import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { auth } from "@/lib/auth.node"
import { prisma } from "@/lib/prisma"
import ProviderHeader from "@/components/provider/ProviderHeader"
import ProviderNav from "@/components/provider/ProviderNav"

export default async function ProviderLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) redirect(`/${locale}`)
  if (session.user.role !== "PROVIDER") redirect(`/${locale}`)

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ProviderHeader
        firstName={profile?.firstName ?? null}
        lastName={profile?.lastName ?? null}
        email={session.user.email ?? null}
        locale={locale}
      />
      <ProviderNav locale={locale} />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  )
}
