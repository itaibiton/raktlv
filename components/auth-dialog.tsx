"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { LogIn, UserPlus } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import { Dictionary } from "@/get-dictionary"

type AuthMode = "sign-in" | "sign-up"

export function AuthDialog({ dictionary }: { dictionary: Dictionary }) {
    const [mode, setMode] = useState<AuthMode>("sign-in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            if (mode === "sign-in") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error

                setOpen(false)
                router.refresh()
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error

                setShowSuccessMessage(true)
            }
        } catch (err: any) {
            // Handle specific error messages
            switch (err.message) {
                case "Invalid login credentials":
                    setError("פרטי ההתחברות שגויים")
                    break
                case "User already registered":
                    setError("כתובת האימייל כבר רשומה במערכת")
                    break
                case "Password should be at least 6 characters":
                    setError("הסיסמה חייבת להכיל לפחות 6 תווים")
                    break
                default:
                    setError(err.message || "אירעה שגיאה, אנא נסה שוב")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setEmail("")
        setPassword("")
        setError(null)
        setShowSuccessMessage(false)
    }

    const handleModeChange = () => {
        setMode(mode === "sign-in" ? "sign-up" : "sign-in")
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen)
            if (!newOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <div className="flex gap-2">
                    <Button asChild size="sm" variant={"default"} className="cursor-pointer">
                        <span className="flex gap-2 items-center"> {dictionary['auth'].signUp}<UserPlus className="w-4 h-4" /></span>
                    </Button>
                    <Button asChild size="sm" variant={"outline"} className="cursor-pointer">
                        <span className="flex gap-2 items-center"> {dictionary['auth'].signIn}<LogIn className="w-4 h-4" /></span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "sign-in" ? "התחברות" : "הרשמה"}
                    </DialogTitle>
                </DialogHeader>

                {showSuccessMessage ? (
                    <div className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                נשלח אליך מייל אימות. אנא בדוק את תיבת הדואר שלך כדי להשלים את ההרשמה.
                            </AlertDescription>
                        </Alert>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            סגור
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">אימייל</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="הכנס את האימייל שלך"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">סיסמה</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="הכנס סיסמה"
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                )}
                                {mode === "sign-in" ? "התחבר" : "הירשם"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleModeChange}
                                disabled={isLoading}
                            >
                                {mode === "sign-in"
                                    ? "אין לך חשבון? הירשם"
                                    : "כבר יש לך חשבון? התחבר"}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
} 