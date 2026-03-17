import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicPath =
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/api/auth/")
      if (isPublicPath) return true
      return isLoggedIn
    },
  },
}

export const { auth } = NextAuth(authConfig)
