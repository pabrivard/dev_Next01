"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signInWithEmail, type SignInResult } from "@/app/actions/auth"

const TOAST_MESSAGES: Partial<Record<string, string>> = {
  USER_NOT_FOUND: "Aucun compte n'est associé à cette adresse email",
  ACCOUNT_INACTIVE: "Votre compte est inactif. Contactez le support.",
  SERVER_ERROR: "Une erreur est survenue. Veuillez réessayer.",
  RESEND_ERROR: "L'envoi de l'email a échoué. Veuillez réessayer.",
}

const INLINE_MESSAGES: Partial<Record<string, string>> = {
  INVALID_EMAIL: "Veuillez saisir une adresse email valide.",
  EMAIL_REQUIRED: "L'adresse email est obligatoire.",
}

export default function SignInPage() {
  const [state, action, pending] = useActionState<SignInResult | null, FormData>(
    signInWithEmail,
    null
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  useEffect(() => {
    if (!state) return
    if (state.success) {
      setSentEmail(state.email)
      setShowSuccess(true)
      return
    }
    const message = TOAST_MESSAGES[state.error]
    if (message) {
      toast.error(message)
    }
  }, [state])

  const inlineError =
    state && !state.success ? (INLINE_MESSAGES[state.error] ?? null) : null

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-md rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl font-bold">
            Connectez-vous à votre compte
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-8 px-8">
          {showSuccess ? (
            <div className="flex flex-col items-center gap-8 py-4">
              <p className="text-center text-sm text-muted-foreground">
                Un lien de connexion vous a été envoyé à l&apos;adresse email
              </p>
              <p className="font-bold text-center">{sentEmail}</p>
              <Button
                type="button"
                className="w-full bg-black text-white hover:bg-black/90 rounded-lg"
                onClick={() => setShowSuccess(false)}
              >
                &lt;-- Retour
              </Button>
            </div>
          ) : (
            <form action={action} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-bold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="adam.smith@email.com"
                    autoComplete="email"
                    className="pl-9"
                  />
                </div>
                {inlineError && (
                  <p className="text-destructive text-xs">{inlineError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-black text-white hover:bg-black/90 rounded-lg"
              >
                {pending ? "Envoi en cours..." : "Se connecter"}
              </Button>

              <div className="flex items-center gap-3 my-1">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">ou</span>
                <Separator className="flex-1" />
              </div>

              <a
                href="#"
                className="text-sm text-muted-foreground text-center hover:underline"
              >
                S&apos;inscrire
              </a>
            </form>
          )}
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 w-full py-4 flex justify-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="hover:underline">
          Conditions Générales d&apos;Utilisation
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Mentions légales
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Politique de confidentialité
        </a>
      </footer>
    </div>
  )
}
