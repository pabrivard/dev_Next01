import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth.node'
import { setRequestLocale } from 'next-intl/server'
import SignInForm from '@/components/auth/SignInForm'

export default async function SignInPage({
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

  return <SignInForm />
}
