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

    // Complete reset function
    const resetModal = () => {
        setMode("sign-in")  // Reset to initial mode
        setEmail("")        // Clear email
        setPassword("")     // Clear password
        setError(null)      // Clear any errors
        setIsLoading(false) // Reset loading state
        setShowSuccessMessage(false) // Reset success message
    }

    // Handle dialog state changes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            // Reset everything when dialog closes
            resetModal()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            if (mode === "sign-in") {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                // Check if email is verified
                if (data.user && !data.user.user_metadata.email_verified) {
                    setError("יש לאמת את כתובת האימייל לפני ההתחברות")
                    return
                }

                setOpen(false)
                // router.refresh()
                window.location.reload()
            } else {
                // Try to sign up
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })

                if (error) throw error

                // Check the response data
                if (data.user) {
                    if (data.user.identities?.length === 0) {
                        // User exists but trying to register again
                        setError("כתובת האימייל כבר רשומה במערכת. אנא התחבר")
                        setMode("sign-in")
                        return
                    }

                    if (!data.user.user_metadata.email_verified) {
                        // New registration or unverified user
                        if (data.user.confirmation_sent_at) {
                            setShowSuccessMessage(true)
                            return
                        }
                    }
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err)

            // Handle specific error messages
            switch (err.message) {
                case "Invalid login credentials":
                    setError("פרטי ההתחברות שגויים")
                    break
                case "Email not confirmed":
                    setError("יש לאמת את כתובת האימייל לפני ההתחברות")
                    break
                case "User already registered":
                    setError("כתובת האימייל כבר רשומה במערכת. אנא התחבר")
                    setMode("sign-in")
                    break
                case "Password should be at least 6 characters":
                    setError("הסיסמה חייבת להכיל לפחות 6 תווים")
                    break
                case "Email rate limit exceeded":
                    setError("נשלחו יותר מדי בקשות. אנא נסה שוב מאוחר יותר")
                    break
                default:
                    setError("אירעה שגיאה, אנא נסה שוב")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendVerification = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            })
            if (error) throw error

            setError(null)
            setShowSuccessMessage(true)
        } catch (err: any) {
            if (err.message === "Email rate limit exceeded") {
                setError("נשלחו יותר מדי בקשות. אנא נסה שוב מאוחר יותר")
            } else {
                setError("שגיאה בשליחת מייל אימות חדש. אנא נסה שוב מאוחר יותר")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleModeChange = () => {
        setMode(prev => prev === "sign-in" ? "sign-up" : "sign-in")
        // resetModal()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex gap-2">
                    <Button onClick={() => setMode("sign-up")} asChild size="sm" variant={"default"} className="cursor-pointer">
                        <span className="flex gap-2 items-center"> {dictionary['auth'].signUp}<UserPlus className="w-4 h-4" /></span>
                    </Button>
                    <Button onClick={() => setMode("sign-in")} asChild size="sm" variant={"outline"} className="cursor-pointer">
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
                            <Alert variant="destructive" className="space-y-2">
                                <AlertDescription>{error}</AlertDescription>
                                {error.includes("לאמת את כתובת האימייל") && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={handleResendVerification}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "שלח מייל אימות מחדש"
                                        )}
                                    </Button>
                                )}
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