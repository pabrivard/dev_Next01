"use client"

import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { signInWithEmail, type SignInResult } from "@/app/actions/auth"

const INITIAL_STATE: SignInResult = { success: false }

export default function SignInPage() {
  const [state, action, pending] = useActionState(signInWithEmail, INITIAL_STATE)

  if (state.success) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              Check your email — a sign-in link has been sent.
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dev_Next01</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {state.error && (
              <p className="text-destructive text-sm">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending..." : "Send magic link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
