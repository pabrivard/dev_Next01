import { auth } from '@/lib/auth.node'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (!session?.user) redirect(`/${locale}`)
  if (session.user.role !== 'ADMIN') redirect(`/${locale}`)

  const t = await getTranslations({ locale, namespace: 'dashboard.admin' })

  return (
    <main className="flex flex-col items-start justify-start px-8 py-16 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-primary mb-6">
        {t('title')}
      </h1>
      <p className="text-lg text-on-surface-variant mb-2">
        {t('welcome', { email: session.user.email ?? '' })}
      </p>
      <p className="text-sm text-on-surface-variant">
        {t('role')}
      </p>
    </main>
  )
}
