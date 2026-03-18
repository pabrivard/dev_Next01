"use server"

import { z } from "zod"
import { signIn } from "@/lib/auth.node"
import { prisma } from "@/lib/prisma"

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "EMAIL_REQUIRED")
    .email("INVALID_EMAIL"),
})

export type SignInResult =
  | { success: true; email: string }
  | { success: false; error: "INVALID_EMAIL" }
  | { success: false; error: "EMAIL_REQUIRED" }
  | { success: false; error: "USER_NOT_FOUND" }
  | { success: false; error: "ACCOUNT_INACTIVE" }
  | { success: false; error: "RESEND_ERROR" }
  | { success: false; error: "SERVER_ERROR" }

export async function signInWithEmail(
  _prevState: SignInResult | null,
  formData: FormData
): Promise<SignInResult> {
  const rawEmail = (formData.get("email") ?? "").toString().trim()

  const result = emailSchema.safeParse({ email: rawEmail })
  if (!result.success) {
    const message = result.error.issues[0]?.message
    if (message === "EMAIL_REQUIRED") return { success: false, error: "EMAIL_REQUIRED" }
    return { success: false, error: "INVALID_EMAIL" }
  }

  const email = result.data.email

  // Check if user exists
  let user
  try {
    user = await prisma.user.findUnique({ where: { email } })
  } catch {
    return { success: false, error: "SERVER_ERROR" }
  }

  if (!user) {
    return { success: false, error: "USER_NOT_FOUND" }
  }

  // Note: user_B_active field does not exist in the current schema.
  // The ACCOUNT_INACTIVE check is skipped until the field is added in a future sprint.

  try {
    await signIn("resend", { email, redirect: false })
    return { success: true, email }
  } catch (error) {
    // SendVerificationRequestError is thrown by Auth.js when the email provider fails
    if (error instanceof Error && error.name === "SendVerificationRequestError") {
      return { success: false, error: "RESEND_ERROR" }
    }
    return { success: false, error: "SERVER_ERROR" }
  }
}
