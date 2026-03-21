import { getTranslations } from "next-intl/server"

export async function getEmailTranslations(locale: string) {
  const t = await getTranslations({ locale, namespace: "email" })
  return t
}
