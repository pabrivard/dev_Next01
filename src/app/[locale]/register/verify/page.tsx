import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import VerifyForm from "@/components/auth/VerifyForm"

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { email } = await searchParams

  if (!email) {
    redirect(`/${locale}/register`)
  }

  return <VerifyForm email={email} />
}
