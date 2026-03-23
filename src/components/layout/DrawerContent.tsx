'use client'

import { useTranslations } from 'next-intl'

type DrawerKey = 'help' | 'legal' | 'privacy' | 'cookies'

type DrawerContentProps = {
  drawerKey: DrawerKey
}

export function DrawerPageContent({ drawerKey }: DrawerContentProps) {
  const t = useTranslations('drawer')

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-4">
        {t(`${drawerKey}.title`)}
      </h2>
      <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
        {t(`${drawerKey}.intro`)}
      </p>

      <h3 className="text-base font-semibold text-on-surface mt-6 mb-2">
        {t(`${drawerKey}.section1Title`)}
      </h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {t(`${drawerKey}.section1Body`)}
      </p>

      <h3 className="text-base font-semibold text-on-surface mt-6 mb-2">
        {t(`${drawerKey}.section2Title`)}
      </h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {t(`${drawerKey}.section2Body`)}
      </p>

      <h3 className="text-base font-semibold text-on-surface mt-6 mb-2">
        {t(`${drawerKey}.section3Title`)}
      </h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">
        {t(`${drawerKey}.section3Body`)}
      </p>
    </div>
  )
}
