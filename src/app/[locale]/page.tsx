import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth.node'
import SignInForm from '@/components/auth/SignInForm'

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (session?.user) {
    redirect(`/${locale}/dashboard`)
  }

  return <SignInForm />
}
