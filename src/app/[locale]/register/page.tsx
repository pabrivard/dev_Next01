import { redirect } from "next/navigation"
import { auth } from "@/lib/auth.node"
import RegisterForm from "@/components/auth/RegisterForm"

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (session?.user) {
    redirect(`/${locale}/dashboard`)
  }

  return <RegisterForm />
}
