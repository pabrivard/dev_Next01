"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { verifyPinAction, resendPinAction, type VerifyResult } from "@/app/actions/register"

const TOAST_ERRORS = ["PIN_EXPIRED", "PIN_BLOCKED", "SERVER_ERROR"]

type VerifyFormProps = {
  email: string
}

export default function VerifyForm({ email }: VerifyFormProps) {
  const t = useTranslations("verify")
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? "fr"

  const [state, dispatch, pending] = useActionState<VerifyResult | null, FormData>(
    verifyPinAction,
    null
  )
  const [isBlocked, setIsBlocked] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      router.push(`/${locale}/provider/dashboard`)
      return
    }
    if (state.error === "PIN_BLOCKED") {
      setIsBlocked(true)
      toast.error(t("errors.pinBlocked"))
    } else if (TOAST_ERRORS.includes(state.error)) {
      const key = state.error === "PIN_EXPIRED" ? "pinExpired" : "serverError"
      toast.error(t(`errors.${key}` as Parameters<typeof t>[0]))
    }
  }, [state, t, router, locale])

  const inlineError =
    state && !state.success && state.error === "PIN_INVALID"
      ? t("errors.pinInvalid", { remaining: state.remaining ?? 0 })
      : null

  async function handleResend() {
    setResending(true)
    try {
      const result = await resendPinAction(email)
      if (result.success) {
        setIsBlocked(false)
        toast.success(t("resendSuccess", { email }))
      } else {
        toast.error(t("errors.serverError"))
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 bg-surface">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-24">

        {/* Left column */}
        <div className="flex-1 text-center md:text-left pt-8 hidden md:block">
          <h1 className="font-headline font-extrabold text-4xl lg:text-5xl text-primary leading-tight mb-6">
            {t("headline")}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Right column — card */}
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-xl shadow-[0_12px_40px_rgba(0,59,99,0.06)] relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />

            <h2 className="text-xl font-bold text-on-surface mb-4">{t("title")}</h2>

            <p className="text-sm text-on-surface-variant mb-1">{t("emailSentTo")}</p>
            <p className="text-sm font-bold text-on-surface mb-2">{email}</p>
            <p className="text-xs text-on-surface-variant mb-6">{t("expiresIn")}</p>

            <form
              action={(formData) => {
                formData.set("email", email)
                dispatch(formData)
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("pinLabel")}
                </label>
                <input
                  name="pin"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t("pinPlaceholder")}
                  autoComplete="one-time-code"
                  className="block w-full text-center text-2xl tracking-widest px-4 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/40 font-mono"
                />
                {inlineError && (
                  <p className="text-error text-xs text-center">{inlineError}</p>
                )}
              </div>

              {!isBlocked && (
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  {pending ? "..." : t("submitButton")}
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full mt-3 border border-primary text-primary font-semibold py-3 rounded-lg hover:bg-surface-container-low transition-colors text-sm disabled:opacity-60"
            >
              {resending ? "..." : t("resendButton")}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
