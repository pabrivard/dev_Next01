import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

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
          <a
            href="#"
            className="text-on-surface-variant text-sm font-medium tracking-tight hover:text-primary-container transition-colors duration-200"
          >
            {t("help")}
          </a>
          <div className="relative group">
            <button className="flex items-center gap-1 text-on-surface-variant text-sm font-medium tracking-tight hover:text-primary-container transition-colors duration-200">
              {currentLocaleLabel}
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="absolute right-0 mt-2 w-36 bg-surface-container-lowest rounded-lg shadow-xl border border-surface-container-high py-2 hidden group-hover:block z-50">
              <Link
                href="/"
                locale={otherLocale as "fr" | "en"}
                className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
              >
                {otherLocaleLabel}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
