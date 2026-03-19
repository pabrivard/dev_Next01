import type { ReactNode } from "react"
import UserInfo from "@/components/layout/UserInfo"

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserInfo />
      {children}
    </>
  )
}
