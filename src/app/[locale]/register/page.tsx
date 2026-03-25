import { redirect } from "next/navigation"
import { auth } from "@/lib/auth.node"
import { setRequestLocale } from "next-intl/server"
import RegisterForm from "@/components/auth/RegisterForm"

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await auth()

  if (session?.user) {
    redirect(`/${locale}/dashboard`)
  }

  return <RegisterForm />
}
