'use client'

import { Dictionary } from "@/get-dictionary";
import { useRtl } from "@/hooks/useRtl";
import { Button } from "./ui/button";
import { type User as UserType } from "@supabase/supabase-js";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { Lock, User2, UserPlus } from "lucide-react";
import { Separator } from "./ui/separator";
import { signOutAction } from "@/app/actions";
import { LogOut, Loader2 } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthDialog } from "./auth-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from './providers/user-provider';
import { createClient } from '@/utils/supabase/client';

const UserPopover = ({ user, dictionary }: { user: UserType | null, dictionary: Dictionary }) => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { isRtl } = useRtl();
    const { refreshUser } = useUser();
    const supabase = createClient();

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            // First sign out on the client side to immediately update client-side state
            await supabase.auth.signOut();

            // Force immediate refresh of user state
            await refreshUser();

            // Close the popover
            setIsOpen(false);

            // Then call the server action to handle server-side logout and redirect
            // Wrap in a timeout to prevent state update/serialization issues
            setTimeout(() => {
                signOutAction().catch(error => {
                    console.error("Sign out server action error:", error);
                });
            }, 0);
        } catch (error) {
            console.error("Sign out error:", error);
            setIsSigningOut(false);
        }
    };

    // if (!user) return <div className="flex gap-2">
    //     <Button asChild size="sm" variant={"outline"}>
    //         <Link className="flex gap-2 items-center" href="/sign-in"> {dictionary['auth'].signIn}<Lock className="w-4 h-4" /></Link>
    //     </Button>
    //     <Button asChild size="sm" variant={"default"}>
    //         <Link className="flex gap-2 items-center" href="/sign-up"> {dictionary['auth'].signUp}<UserPlus className="w-4 h-4" /></Link>
    //     </Button>
    // </div>

    if (!user) return <AuthDialog dictionary={dictionary} />

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="default" size="icon" className="rounded-full">
                    {user?.email ? user.email[0].toUpperCase() : ''}
                </Button>
            </PopoverTrigger>
            <PopoverContent align={isRtl ? 'start' : 'end'} className="mt-2 flex flex-col">
                <Link href={'/profile'}>
                    <Button type="submit" variant="ghost" className="flex gap-2 items-center justify-start w-full" size={"sm"}>
                        <User2 className="w-4 h-4" />
                        <p>{user?.email}</p>
                    </Button>
                </Link>
                <Separator className="mt-2 mb-4" />
                <div className="flex w-full justify-between">
                    <Button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        variant="ghost"
                        className="flex gap-2 items-center justify-start w-fit"
                        size={"sm"}
                    >
                        {isSigningOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        <p className="">
                            {dictionary['auth'].signOut}
                        </p>
                    </Button>
                    {/* <ThemeSwitcher /> */}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default UserPopover;