import { Resend } from "resend"
import { render } from "@react-email/render"
import { createElement } from "react"
import MagicLinkEmail from "../../emails/magic-link"
import RegistrationEmail from "../../emails/registration"
import { getEmailTranslations } from "@/lib/email-translations"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLinkEmail({
  to,
  url,
  locale,
}: {
  to: string
  url: string
  locale: string
}): Promise<void> {
  const t = await getEmailTranslations(locale)

  const translations = {
    systemLabel: t("magicLink.systemLabel"),
    greeting: t("magicLink.greeting"),
    body: t("magicLink.body"),
    ctaButton: t("magicLink.ctaButton"),
    fallbackText: t("magicLink.fallbackText"),
  }

  const subject = t("magicLink.subject")
  const html = await render(createElement(MagicLinkEmail, { url, locale, translations }))

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "",
    to,
    subject,
    html,
  })
}

export async function sendRegistrationEmail({
  to,
  pin,
  firstName,
  locale,
}: {
  to: string
  pin: string
  firstName: string
  locale: string
}): Promise<void> {
  const t = await getEmailTranslations(locale)

  const translations = {
    systemLabel: t("registration.systemLabel"),
    greeting: t("registration.greeting", { firstName }),
    body: t("registration.body"),
    pinLabel: t("registration.pinLabel"),
    expiryNote: t("registration.expiryNote"),
    fallbackText: t("registration.fallbackText"),
  }

  const subject = t("registration.subject")
  const html = await render(createElement(RegistrationEmail, { pin, firstName, locale, translations }))

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "",
    to,
    subject,
    html,
  })
}
