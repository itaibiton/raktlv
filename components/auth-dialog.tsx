"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { LogIn, UserPlus } from "lucide-react"
import { useDictionary } from "./providers/providers.tsx"
import { Dictionary } from "@/get-dictionary"
type AuthMode = "sign-in" | "sign-up"

export function AuthDialog({ dictionary }: { dictionary: Dictionary }) {
    const [mode, setMode] = useState<AuthMode>("sign-in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (mode === "sign-in") {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (!error) {
                setOpen(false)
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (!error) {
                setOpen(false)
                // Show success message or handle verification email sent
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">אימייל</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="הכנס את האימייל שלך"
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
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button type="submit">
                            {mode === "sign-in" ? "התחבר" : "הירשם"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                        >
                            {mode === "sign-in"
                                ? "אין לך חשבון? הירשם"
                                : "כבר יש לך חשבון? התחבר"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 