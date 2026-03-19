import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Resend from "next-auth/providers/resend"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/lib/auth"
import type { Role } from "@/generated/prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    authorized({ auth: authSession, request }) {
      const user = authSession?.user
      const pathname = request.nextUrl.pathname

      if (!user) return false
      if (user.role === "ADMIN") return true

      if (user.role === "CLIENT") {
        if (pathname.includes("/provider/")) return false
        return true
      }

      if (user.role === "PROVIDER") {
        if (pathname.includes("/client/")) return false
        return true
      }

      return false
    },
    session({ session, user }) {
      session.user.role = (user as unknown as { role: Role }).role
      return session
    },
  },
})
