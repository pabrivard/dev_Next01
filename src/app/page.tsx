import { auth } from "@/lib/auth.node"
import { Card, CardContent } from "@/components/ui/card"
import SignInForm from "@/components/SignInForm"

export default async function SignInPage() {
  const session = await auth()

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      {session?.user ? (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-sm text-center">✅ Magic link valid</p>
          </CardContent>
        </Card>
      ) : (
        <SignInForm />
      )}
    </main>
  )
}
