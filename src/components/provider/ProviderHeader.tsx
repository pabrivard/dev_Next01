"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
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
          <Button variant="ghost" size="icon" aria-label={t("search")}>
            <Search className="h-5 w-5 text-on-surface-variant" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" aria-label={t("notifications")}>
            <Bell className="h-5 w-5 text-on-surface-variant" />
          </Button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-on-surface-variant gap-1 px-2"
              >
                {currentLocaleLabel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-20">
              <DropdownMenuItem asChild>
                <Link
                  href={pathname}
                  locale={otherLocale as "fr" | "en"}
                  className="w-full cursor-pointer"
                >
                  {otherLocaleLabel}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3"
              >
                <CircleUser className="h-5 w-5 text-on-surface-variant" />
                <span className="hidden md:inline text-sm font-medium text-on-surface">
                  {displayName}
                </span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href={`/${locale}/provider/dashboard`}
                  className="w-full cursor-pointer"
                >
                  {t("mySpace")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
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
