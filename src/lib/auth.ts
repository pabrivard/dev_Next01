import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/",
  },
  providers: [],
  callbacks: {
    authorized({ auth: authSession, request }) {
      const user = authSession?.user
      const pathname = request.nextUrl.pathname

      // Allow root, locale roots (/fr, /en), and auth API endpoints
      const isPublicPath =
        pathname === "/" ||
        pathname === "/fr" ||
        pathname === "/en" ||
        pathname.startsWith("/api/auth/")
      if (isPublicPath) return true

      if (!user) return false
      if (user.role === "ADMIN") return true

      if (user.role === "CLIENT") {
        if (pathname.includes("/provider/") || pathname.includes("/admin/")) return false
        return true
      }

      if (user.role === "PROVIDER") {
        if (pathname.includes("/client/") || pathname.includes("/admin/")) return false
        return true
      }

      return false
    },
  },
}

export const { auth } = NextAuth(authConfig)
