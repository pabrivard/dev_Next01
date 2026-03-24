"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { signInWithEmail, type SignInResult } from "@/app/actions/auth"
import { version } from "../../../package.json"

const TOAST_ERRORS = ["USER_NOT_FOUND", "ACCOUNT_INACTIVE", "SERVER_ERROR", "RESEND_ERROR"]
const INLINE_ERRORS = ["INVALID_EMAIL", "EMAIL_REQUIRED"]

export default function SignInForm() {
  const t = useTranslations("signIn")

  const [state, action, pending] = useActionState<SignInResult | null, FormData>(
    signInWithEmail,
    null
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  useEffect(() => {
    if (!state) return
    if (state.success) {
      setSentEmail(state.email)
      setShowSuccess(true)
      return
    }
    if (TOAST_ERRORS.includes(state.error)) {
      toast.error(t(`errors.${state.error}` as Parameters<typeof t>[0]))
    }
  }, [state, t])

  const inlineError =
    state && !state.success && INLINE_ERRORS.includes(state.error)
      ? t(`errors.${state.error}` as Parameters<typeof t>[0])
      : null

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 bg-surface">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-24">

        {/* Left column */}
        <div className="flex-1 text-center md:text-left pt-8">
          <h1 className="font-headline font-extrabold text-4xl lg:text-5xl text-primary leading-tight mb-6">
            {t("headline")}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="mt-12 hidden md:block">
            <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-primary">
              <p className="text-sm font-medium text-primary mb-1">{t("newBadge")}</p>
              <p className="text-sm text-on-surface-variant">
                {t("versionInfo", { version })}
              </p>
            </div>
          </div>
        </div>

        {/* Right column — card */}
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-xl shadow-[0_12px_40px_rgba(0,59,99,0.06)] relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />

            {showSuccess ? (
              <div className="flex flex-col items-center gap-8">
                <p className="text-center text-sm text-on-surface-variant">
                  {t("successMessage")}
                </p>
                <p className="font-bold text-center text-on-surface">{sentEmail}</p>
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary-container transition-all shadow-lg"
                >
                  {t("backButton")}
                </button>
              </div>
            ) : (
              <form action={action} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                  >
                    {t("emailLabel")}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-outline-variant pointer-events-none">
                      <span className="material-symbols-outlined text-xl">mail</span>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary-fixed focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/60"
                    />
                  </div>
                  {inlineError && (
                    <p className="text-error text-xs">{inlineError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  {pending ? t("submitting") : t("submitButton")}
                </button>
              </form>
            )}

            <div className="mt-10 pt-8 border-t border-surface-container-high text-center">
              <p className="text-sm text-on-surface-variant mb-4">{t("registerPrompt")}</p>
              <Link
                href="/register"
                className="block w-full border border-primary text-primary font-bold py-3 rounded-lg hover:bg-surface-container-low transition-colors text-sm text-center"
              >
                {t("registerButton")}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-base">verified_user</span>
            {t("secureConnection")}
          </div>
        </div>

      </div>
    </div>
  )
}
