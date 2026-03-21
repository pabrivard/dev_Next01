import { Resend } from "resend"
import { render } from "@react-email/render"
import { createElement } from "react"
import MagicLinkEmail from "../../emails/magic-link"
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
    signatureClosing: t("magicLink.signatureClosing"),
    signatureName: t("magicLink.signatureName"),
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
