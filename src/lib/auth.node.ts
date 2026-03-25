import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Resend from "next-auth/providers/resend"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/lib/auth"
import { sendMagicLinkEmail } from "@/lib/mail"
import type { Role } from "@/generated/prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        const callbackUrl = new URL(url).searchParams.get("callbackUrl") ?? ""
        const localeMatch = callbackUrl.match(/^\/(fr|en)(\/|$)/)
        const locale = localeMatch?.[1] ?? "fr"
        await sendMagicLinkEmail({ to: identifier, url, locale })
      },
    }),
  ],
  callbacks: {
    authorized({ auth: authSession, request }) {
      const user = authSession?.user
      const pathname = request.nextUrl.pathname

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
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return `${baseUrl}/fr/dashboard`
    },
    async session({ session, user }) {
      const adapterUser = user as unknown as { role: Role; active: boolean }
      session.user.role = adapterUser.role
      session.user.active = adapterUser.active
      return session
    },
  },
})
