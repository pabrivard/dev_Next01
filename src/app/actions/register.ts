"use server"

import crypto from "crypto"
import { cookies } from "next/headers"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js"
import { getLocale } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { sendRegistrationEmail } from "@/lib/mail"

// ─── Types ────────────────────────────────────────────────────────────────────

type RegisterErrorCode =
  | "GENDER_REQUIRED"
  | "LAST_NAME_REQUIRED"
  | "FIRST_NAME_REQUIRED"
  | "EMAIL_REQUIRED"
  | "EMAIL_INVALID"
  | "PHONE_REQUIRED"
  | "PHONE_INVALID"
  | "ACCEPT_TERMS_REQUIRED"
  | "ACCEPT_PRIVACY_REQUIRED"
  | "EMAIL_ALREADY_EXISTS"
  | "SERVER_ERROR"

export type RegisterResult =
  | { success: true; email: string }
  | { success: false; error: RegisterErrorCode }

type VerifyErrorCode =
  | "PIN_REQUIRED"
  | "PIN_INVALID"
  | "PIN_EXPIRED"
  | "PIN_BLOCKED"
  | "SERVER_ERROR"

export type VerifyResult =
  | { success: true }
  | { success: false; error: VerifyErrorCode; remaining?: number }

export type ResendResult =
  | { success: true; email: string }
  | { success: false; error: "SERVER_ERROR" }

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  gender: z.string().min(1, "GENDER_REQUIRED"),
  lastName: z.string().min(1, "LAST_NAME_REQUIRED"),
  firstName: z.string().min(1, "FIRST_NAME_REQUIRED"),
  email: z.string().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  phoneCountry: z.string().min(1, "PHONE_REQUIRED"),
  phoneCode: z.string().min(1, "PHONE_REQUIRED"),
  phoneNumber: z.string().min(1, "PHONE_REQUIRED"),
})

const pinSchema = z.object({
  pin: z
    .string()
    .min(1, "PIN_REQUIRED")
    .regex(/^\d{6}$/, "PIN_REQUIRED"),
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(^|[\s-])\w/g, (c) => c.toUpperCase())
}

function generatePin(): string {
  return String(crypto.randomInt(100000, 999999))
}

async function createAndSendPin(email: string, firstName: string, locale: string): Promise<void> {
  const plainPin = generatePin()
  const hashedPin = await bcrypt.hash(plainPin, 10)
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours

  await prisma.registrationPin.deleteMany({ where: { email } })
  await prisma.registrationPin.create({
    data: { email, code: hashedPin, expires },
  })

  await sendRegistrationEmail({ to: email, pin: plainPin, firstName, locale })
}

// ─── registerAction ───────────────────────────────────────────────────────────

export async function registerAction(
  _prevState: RegisterResult | null,
  formData: FormData
): Promise<RegisterResult> {
  const raw = {
    gender: (formData.get("gender") ?? "").toString().trim(),
    lastName: (formData.get("lastName") ?? "").toString().trim(),
    firstName: (formData.get("firstName") ?? "").toString().trim(),
    email: (formData.get("email") ?? "").toString().trim().toLowerCase(),
    phoneCountry: (formData.get("phoneCountry") ?? "").toString().trim(),
    phoneCode: (formData.get("phoneCode") ?? "").toString().trim(),
    phoneNumber: (formData.get("phoneNumber") ?? "").toString().trim(),
  }

  const acceptTerms = formData.get("acceptTerms") === "on"
  const acceptPrivacy = formData.get("acceptPrivacy") === "on"

  const result = registerSchema.safeParse(raw)
  if (!result.success) {
    const code = result.error.issues[0]?.message as RegisterErrorCode
    return { success: false, error: code }
  }

  if (!acceptTerms) return { success: false, error: "ACCEPT_TERMS_REQUIRED" }
  if (!acceptPrivacy) return { success: false, error: "ACCEPT_PRIVACY_REQUIRED" }

  const { gender, lastName, firstName, email, phoneCountry, phoneCode, phoneNumber } = result.data

  if (!isValidPhoneNumber(phoneNumber, phoneCountry as CountryCode)) {
    return { success: false, error: "PHONE_INVALID" }
  }

  const normalizedLastName = lastName.toUpperCase()
  const normalizedFirstName = toTitleCase(firstName)
  const fullName = `${normalizedFirstName} ${normalizedLastName}`

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return { success: false, error: "EMAIL_ALREADY_EXISTS" }

    const now = new Date()
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        role: "PROVIDER",
        active: true,
        acceptTerms: true,
        acceptTermsAt: now,
        acceptPrivacy: true,
        acceptPrivacyAt: now,
      },
    })

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        gender,
        lastName: normalizedLastName,
        firstName: normalizedFirstName,
        phoneCode,
        phoneNumber,
      },
    })

    const locale = await getLocale()
    await createAndSendPin(email, firstName, locale)

    return { success: true, email }
  } catch {
    return { success: false, error: "SERVER_ERROR" }
  }
}

// ─── verifyPinAction ──────────────────────────────────────────────────────────

export async function verifyPinAction(
  _prevState: VerifyResult | null,
  formData: FormData
): Promise<VerifyResult> {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase()
  const rawPin = (formData.get("pin") ?? "").toString().trim()

  const result = pinSchema.safeParse({ pin: rawPin })
  if (!result.success) return { success: false, error: "PIN_REQUIRED" }

  try {
    const pinEntry = await prisma.registrationPin.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    })

    if (!pinEntry) return { success: false, error: "PIN_EXPIRED" }
    if (pinEntry.blocked) return { success: false, error: "PIN_BLOCKED" }
    if (pinEntry.expires < new Date()) return { success: false, error: "PIN_EXPIRED" }

    const isValid = await bcrypt.compare(rawPin, pinEntry.code)

    if (!isValid) {
      const newAttempts = pinEntry.attempts + 1
      const blocked = newAttempts >= 3

      await prisma.registrationPin.update({
        where: { id: pinEntry.id },
        data: { attempts: newAttempts, blocked },
      })

      if (blocked) return { success: false, error: "PIN_BLOCKED" }
      return { success: false, error: "PIN_INVALID", remaining: 3 - newAttempts }
    }

    // PIN correct — clean up and create session
    await prisma.registrationPin.delete({ where: { id: pinEntry.id } })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { success: false, error: "SERVER_ERROR" }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    // Create Auth.js-compatible session directly in the database
    const sessionToken = crypto.randomUUID()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await prisma.session.create({
      data: { sessionToken, userId: user.id, expires },
    })

    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token"

    const cookieStore = await cookies()
    cookieStore.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    })

    return { success: true }
  } catch {
    return { success: false, error: "SERVER_ERROR" }
  }
}

// ─── resendPinAction ──────────────────────────────────────────────────────────

export async function resendPinAction(email: string): Promise<ResendResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
    if (!user) return { success: false, error: "SERVER_ERROR" }

    const firstName = user.profile?.firstName ?? ""
    const locale = await getLocale()
    await createAndSendPin(email, firstName, locale)

    return { success: true, email }
  } catch {
    return { success: false, error: "SERVER_ERROR" }
  }
}
