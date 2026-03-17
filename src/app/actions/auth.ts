"use server"

import { z } from "zod"
import { AuthError } from "next-auth"
import { signIn } from "@/lib/auth.node"

const emailSchema = z
  .string()
  .min(1, "Email address is required.")
  .email("Please enter a valid email address.")

export type SignInResult = { success: boolean; error?: string }

export async function signInWithEmail(
  _prevState: SignInResult,
  formData: FormData
): Promise<SignInResult> {
  const rawEmail = (formData.get("email") ?? "").toString()

  const result = emailSchema.safeParse(rawEmail)
  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Please enter a valid email address."
    return { success: false, error: message }
  }

  try {
    await signIn("resend", { email: result.data, redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Something went wrong. Please try again." }
    }
    throw error
  }
}
