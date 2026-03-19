import { auth } from "@/lib/auth.node"

export default async function UserInfo() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <div className="w-full bg-muted px-4 py-2 flex items-center gap-3 text-sm text-muted-foreground">
      <span>{session.user.email}</span>
      <span className="text-xs font-medium uppercase tracking-wide bg-background border rounded px-1.5 py-0.5">
        {session.user.role}
      </span>
    </div>
  )
}
