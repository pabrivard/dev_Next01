"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  CircleUser,
  Briefcase,
  FolderOpen,
  Receipt,
} from "lucide-react"

type ProviderNavProps = {
  locale: string
}

export default function ProviderNav({ locale }: ProviderNavProps) {
  const t = useTranslations("provider")
  const router = useRouter()
  const pathname = usePathname()

  // Extract active segment: /fr/provider/dashboard → "dashboard"
  const segment = pathname.split("/provider/")?.[1]?.split("/")?.[0] ?? "dashboard"

  const tabs = [
    {
      value: "dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
    {
      value: "profile",
      label: t("nav.profile"),
      icon: CircleUser,
    },
    {
      value: "mission-search",
      label: t("nav.missionSearch"),
      icon: Briefcase,
    },
    {
      value: "missions",
      label: t("nav.missions"),
      icon: FolderOpen,
    },
    {
      value: "accounting",
      label: t("nav.accounting"),
      icon: Receipt,
    },
  ]

  return (
    <div className="w-full bg-[#e8eaf6] px-6 pt-6">
      <h1 className="text-lg font-bold text-on-surface mb-4">
        {t("layout.spaceTitle")}
      </h1>
      <Tabs value={segment}>
        <TabsList className="bg-transparent gap-3 !h-auto p-0 overflow-x-auto flex-nowrap rounded-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() =>
                  router.push(`/${locale}/provider/${tab.value}`)
                }
                className="flex items-center gap-2 px-4 !h-[60px] rounded-t-lg !rounded-bl-none !rounded-br-none whitespace-nowrap text-on-surface-variant bg-white/30 data-active:bg-white data-active:text-primary data-active:!shadow-none cursor-pointer"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline font-bold">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}
