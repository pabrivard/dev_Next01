import createIntlMiddleware from "next-intl/middleware"
import { auth } from "@/lib/auth"
import { routing } from "@/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

export default auth(function middleware(req) {
  return intlMiddleware(req)
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
