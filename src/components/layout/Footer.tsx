import { getTranslations } from "next-intl/server"

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
          <a
            href="#"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            {t("legal")}
          </a>
          <a
            href="#"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            {t("privacy")}
          </a>
          <a
            href="#"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            {t("cookies")}
          </a>
        </div>
      </div>
    </footer>
  )
}
