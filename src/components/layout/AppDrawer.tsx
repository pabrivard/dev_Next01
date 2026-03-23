'use client'

import { useTranslations } from 'next-intl'
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { DrawerPageContent } from './DrawerContent'

type DrawerKey = 'help' | 'legal' | 'privacy' | 'cookies'

type AppDrawerProps = {
  drawerKey: DrawerKey
  trigger: React.ReactNode
}

export function AppDrawer({ drawerKey, trigger }: AppDrawerProps) {
  const t = useTranslations('drawer')

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent
        className="top-0 right-0 left-auto mt-0 h-full w-full max-w-[90vw] sm:max-w-[50vw] lg:max-w-[33vw] rounded-none border-l border-surface-container-high"
      >
        <DrawerTitle className="sr-only">{t(`${drawerKey}.title`)}</DrawerTitle>
        <div className="flex flex-col h-full overflow-y-auto p-8">
          <div className="flex justify-end mb-6">
            <DrawerClose asChild>
              <button className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                {t('close')}
              </button>
            </DrawerClose>
          </div>
          <DrawerPageContent drawerKey={drawerKey} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
