import { redirect } from "next/navigation"
import VerifyForm from "@/components/auth/VerifyForm"

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { locale } = await params
  const { email } = await searchParams

  if (!email) {
    redirect(`/${locale}/register`)
  }

  return <VerifyForm email={email} />
}
