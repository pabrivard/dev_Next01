import { getTranslations } from "next-intl/server"
import { AppDrawer } from "@/components/layout/AppDrawer"
import LocaleSwitcher from "@/components/layout/LocaleSwitcher"

interface HeaderProps {
  locale: string
}

export default async function Header({ locale }: HeaderProps) {
  const t = await getTranslations("common")

  const otherLocale = locale === "fr" ? "en" : "fr"
  const currentLocaleLabel = locale === "fr" ? "Français" : "English"
  const otherLocaleLabel = locale === "fr" ? "English" : "Français"

  return (
    <header className="w-full bg-surface-bright border-b border-surface-container-high">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        <div className="text-xl font-bold text-primary uppercase tracking-wider">
          {t("appName")}
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <AppDrawer
            drawerKey="help"
            label={t("help")}
            className="cursor-pointer text-on-surface-variant text-sm font-medium tracking-tight hover:text-primary transition-colors duration-200"
          />
          <LocaleSwitcher
            currentLocale={locale}
            currentLocaleLabel={currentLocaleLabel}
            otherLocale={otherLocale as "fr" | "en"}
            otherLocaleLabel={otherLocaleLabel}
          />
        </nav>
      </div>
    </header>
  )
}
