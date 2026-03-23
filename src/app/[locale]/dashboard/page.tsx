import { auth } from '@/lib/auth.node'
import { redirect } from 'next/navigation'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (!session?.user) {
    redirect(`/${locale}`)
  }

  const role = session.user.role

  if (role === 'ADMIN') redirect(`/${locale}/admin/dashboard`)
  if (role === 'CLIENT') redirect(`/${locale}/client/dashboard`)
  if (role === 'PROVIDER') redirect(`/${locale}/provider/dashboard`)

  redirect(`/${locale}`)
}
