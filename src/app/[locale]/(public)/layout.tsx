import type { ReactNode } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </div>
  )
}
