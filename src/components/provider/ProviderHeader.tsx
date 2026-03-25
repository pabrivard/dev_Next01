"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, CircleUser, ChevronDown } from "lucide-react"
import { signOutAction } from "@/app/actions/auth"

type ProviderHeaderProps = {
  firstName: string | null
  lastName: string | null
  email: string | null
  locale: string
}

export default function ProviderHeader({
  firstName,
  lastName,
  email,
  locale,
}: ProviderHeaderProps) {
  const t = useTranslations("provider.layout")

  const fullPathname = usePathname()
  const localePattern = routing.locales.join("|")
  const pathname =
    fullPathname.replace(new RegExp(`^/(${localePattern})(/|$)`), "/") || "/"

  const otherLocale = locale === "fr" ? "en" : "fr"
  const currentLocaleLabel = locale.toUpperCase()
  const otherLocaleLabel = otherLocale.toUpperCase()

  const displayName =
    firstName && lastName ? `${firstName} ${lastName}` : (email ?? "")

  const triggerBase =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

  return (
    <header className="w-full bg-white border-b border-surface-container-high px-6 py-3">
      <div className="flex items-center justify-between">
        {/* App name */}
        <div className="text-lg font-bold text-primary uppercase tracking-wider">
          DEV_NEXT01
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            aria-label={t("search")}
            className={`${triggerBase} h-9 w-9 text-on-surface-variant`}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            aria-label={t("notifications")}
            className={`${triggerBase} h-9 w-9 text-on-surface-variant`}
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${triggerBase} h-9 px-2 text-on-surface-variant`}
            >
              {currentLocaleLabel}
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="!w-20">
              <DropdownMenuItem>
                <Link
                  href={pathname}
                  locale={otherLocale as "fr" | "en"}
                  className="w-full"
                >
                  {otherLocaleLabel}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${triggerBase} h-9 px-3 text-on-surface-variant gap-2`}
            >
              <CircleUser className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium text-on-surface">
                {displayName}
              </span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="!w-48">
              <DropdownMenuItem>
                <Link
                  href={`/${locale}/provider/dashboard`}
                  className="w-full"
                >
                  {t("mySpace")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action={signOutAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full text-left text-error cursor-pointer"
                  >
                    {t("signOut")}
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
