"use client"

import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

interface LocaleSwitcherProps {
  currentLocale: string
  currentLocaleLabel: string
  otherLocale: "fr" | "en"
  otherLocaleLabel: string
}

export default function LocaleSwitcher({
  currentLocaleLabel,
  otherLocale,
  otherLocaleLabel,
}: LocaleSwitcherProps) {
  const fullPathname = usePathname()
  // Strip the locale prefix so next-intl's Link can add the target locale
  const localePattern = routing.locales.join("|")
  const pathname =
    fullPathname.replace(new RegExp(`^/(${localePattern})(/|$)`), "/") || "/"

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-on-surface-variant text-sm font-medium tracking-tight hover:text-primary-container transition-colors duration-200">
        {currentLocaleLabel}
        <span className="material-symbols-outlined text-sm">expand_more</span>
      </button>
      <div className="absolute right-0 top-full pt-2 w-36 hidden group-hover:block z-50">
        <div className="bg-surface-container-lowest rounded-lg shadow-xl border border-surface-container-high py-2">
          <Link
            href={pathname}
            locale={otherLocale}
            className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
          >
            {otherLocaleLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
