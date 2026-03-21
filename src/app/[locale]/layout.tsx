import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/i18n/routing"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import UserInfo from "@/components/layout/UserInfo"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col bg-surface">
        <Header locale={locale} />
        <UserInfo />
        {children}
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  )
}
