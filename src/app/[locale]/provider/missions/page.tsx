import { setRequestLocale } from "next-intl/server"

export default async function ProviderMissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <div className="p-8" />
}
