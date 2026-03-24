"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AppDrawer } from "@/components/layout/AppDrawer"
import { registerAction, type RegisterResult } from "@/app/actions/register"

const TOAST_ERRORS = ["EMAIL_ALREADY_EXISTS", "SERVER_ERROR"]

const COUNTRY_CODES = [
  { code: "+33", flag: "🇫🇷", label: "+33" },
  { code: "+1", flag: "🇺🇸", label: "+1" },
  { code: "+44", flag: "🇬🇧", label: "+44" },
  { code: "+32", flag: "🇧🇪", label: "+32" },
  { code: "+41", flag: "🇨🇭", label: "+41" },
  { code: "+352", flag: "🇱🇺", label: "+352" },
  { code: "+49", flag: "🇩🇪", label: "+49" },
]

export default function RegisterForm() {
  const t = useTranslations("register")
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? "fr"

  const [state, action, pending] = useActionState<RegisterResult | null, FormData>(
    registerAction,
    null
  )

  const [gender, setGender] = useState("")
  const [phoneCode, setPhoneCode] = useState("+33")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      router.push(`/${locale}/register/verify?email=${encodeURIComponent(state.email)}`)
      return
    }
    if (TOAST_ERRORS.includes(state.error)) {
      const key = state.error === "EMAIL_ALREADY_EXISTS" ? "emailAlreadyExists" : "serverError"
      toast.error(t(`errors.${key}` as Parameters<typeof t>[0]))
    }
  }, [state, t, router, locale])

  const fieldError = (code: string): string | null => {
    if (!state || state.success) return null
    const map: Record<string, string> = {
      GENDER_REQUIRED: "errors.genderRequired",
      LAST_NAME_REQUIRED: "errors.lastNameRequired",
      FIRST_NAME_REQUIRED: "errors.firstNameRequired",
      EMAIL_REQUIRED: "errors.emailRequired",
      EMAIL_INVALID: "errors.emailInvalid",
      PHONE_REQUIRED: "errors.phoneRequired",
      PHONE_INVALID: "errors.phoneInvalid",
      ACCEPT_TERMS_REQUIRED: "errors.acceptTermsRequired",
      ACCEPT_PRIVACY_REQUIRED: "errors.acceptPrivacyRequired",
    }
    return state.error === code ? t(map[code] as Parameters<typeof t>[0]) : null
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 bg-surface">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-start gap-12 lg:gap-24">

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
        <div className="w-full max-w-md mx-auto md:mx-0">
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-xl shadow-[0_12px_40px_rgba(0,59,99,0.06)] relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />

            <h2 className="text-xl font-bold text-on-surface mb-6">{t("title")}</h2>

            <form action={action} className="space-y-5">
              {/* Hidden inputs for controlled values */}
              <input type="hidden" name="gender" value={gender} />
              <input type="hidden" name="phoneCode" value={phoneCode} />
              <input type="hidden" name="acceptTerms" value={acceptTerms ? "on" : ""} />
              <input type="hidden" name="acceptPrivacy" value={acceptPrivacy ? "on" : ""} />

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("genderLabel")}
                </label>
                <Select onValueChange={(v) => setGender(v ?? "")} value={gender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("genderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("genderMale")}</SelectItem>
                    <SelectItem value="female">{t("genderFemale")}</SelectItem>
                    <SelectItem value="neutral">{t("genderNeutral")}</SelectItem>
                  </SelectContent>
                </Select>
                {fieldError("GENDER_REQUIRED") && (
                  <p className="text-error text-xs">{fieldError("GENDER_REQUIRED")}</p>
                )}
              </div>

              {/* Last name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("lastNameLabel")}
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder={t("lastNamePlaceholder")}
                  className="block w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/60"
                />
                {fieldError("LAST_NAME_REQUIRED") && (
                  <p className="text-error text-xs">{fieldError("LAST_NAME_REQUIRED")}</p>
                )}
              </div>

              {/* First name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("firstNameLabel")}
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder={t("firstNamePlaceholder")}
                  className="block w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/60"
                />
                {fieldError("FIRST_NAME_REQUIRED") && (
                  <p className="text-error text-xs">{fieldError("FIRST_NAME_REQUIRED")}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("emailLabel")}
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  className="block w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/60"
                />
                {(fieldError("EMAIL_REQUIRED") || fieldError("EMAIL_INVALID")) && (
                  <p className="text-error text-xs">
                    {fieldError("EMAIL_REQUIRED") ?? fieldError("EMAIL_INVALID")}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {t("phoneLabel")}
                </label>
                <div className="flex gap-2">
                  <div className="w-28 shrink-0">
                    <Select onValueChange={(v) => setPhoneCode(v ?? "+33")} value={phoneCode}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map(({ code, flag, label }) => (
                          <SelectItem key={code} value={code}>
                            {flag} {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-on-surface placeholder:text-outline-variant/60"
                  />
                </div>
                {(fieldError("PHONE_REQUIRED") || fieldError("PHONE_INVALID")) && (
                  <p className="text-error text-xs">
                    {fieldError("PHONE_REQUIRED") ?? fieldError("PHONE_INVALID")}
                  </p>
                )}
              </div>

              {/* Accept Terms */}
              <div className="space-y-1">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(v) => setAcceptTerms(v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-on-surface-variant leading-snug cursor-pointer">
                    {t("acceptTerms")}{" "}
                    <AppDrawer
                      drawerKey="legal"
                      label="→"
                      className="cursor-pointer text-primary text-sm hover:underline"
                    />
                  </label>
                </div>
                {fieldError("ACCEPT_TERMS_REQUIRED") && (
                  <p className="text-error text-xs">{fieldError("ACCEPT_TERMS_REQUIRED")}</p>
                )}
              </div>

              {/* Accept Privacy */}
              <div className="space-y-1">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(v) => setAcceptPrivacy(v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="acceptPrivacy" className="text-sm text-on-surface-variant leading-snug cursor-pointer">
                    {t("acceptPrivacy")}{" "}
                    <AppDrawer
                      drawerKey="privacy"
                      label="→"
                      className="cursor-pointer text-primary text-sm hover:underline"
                    />
                  </label>
                </div>
                {fieldError("ACCEPT_PRIVACY_REQUIRED") && (
                  <p className="text-error text-xs">{fieldError("ACCEPT_PRIVACY_REQUIRED")}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20 disabled:opacity-60 mt-2"
              >
                {pending ? "..." : t("submitButton")}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-on-surface-variant">
            {t("alreadyAccount")}{" "}
            <Link
              href="/"
              className="text-primary font-medium hover:underline"
            >
              {t("signInLink")}
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
