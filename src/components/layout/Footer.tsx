import { getTranslations } from "next-intl/server"
import { AppDrawer } from "@/components/layout/AppDrawer"

interface FooterProps {
  locale: string
}

export default async function Footer({ locale }: FooterProps) {
  const t = await getTranslations("footer")

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/20">
      <div className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="text-lg font-semibold text-primary">DEV_NEXT01</div>
          <p className="text-xs text-on-surface-variant">{t("copyright")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <AppDrawer
            drawerKey="legal"
            label={t("legal")}
            className="cursor-pointer text-xs text-on-surface-variant hover:text-primary transition-colors"
          />
          <AppDrawer
            drawerKey="privacy"
            label={t("privacy")}
            className="cursor-pointer text-xs text-on-surface-variant hover:text-primary transition-colors"
          />
          <AppDrawer
            drawerKey="cookies"
            label={t("cookies")}
            className="cursor-pointer text-xs text-on-surface-variant hover:text-primary transition-colors"
          />
        </div>
      </div>
    </footer>
  )
}
