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
import { LogOut } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthDialog } from "./auth-dialog";

const UserPopover = ({ user, dictionary }: { user: UserType | null, dictionary: Dictionary }) => {

    const { isRtl } = useRtl();

    // if (!user) return <div className="flex gap-2">
    //     <Button asChild size="sm" variant={"outline"}>
    //         <Link className="flex gap-2 items-center" href="/sign-in"> {dictionary['auth'].signIn}<Lock className="w-4 h-4" /></Link>
    //     </Button>
    //     <Button asChild size="sm" variant={"default"}>
    //         <Link className="flex gap-2 items-center" href="/sign-up"> {dictionary['auth'].signUp}<UserPlus className="w-4 h-4" /></Link>
    //     </Button>
    // </div>

    if (!user) return <AuthDialog dictionary={dictionary} />

    return <Popover>
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
                <Button onClick={signOutAction} variant="ghost" className="flex gap-2 items-center justify-start w-fit" size={"sm"}>
                    <LogOut className="w-4 h-4" />
                    <p className="">
                        {dictionary['auth'].signOut}
                    </p>
                </Button>
                {/* <ThemeSwitcher /> */}
            </div>

        </PopoverContent>
    </Popover>
}

export default UserPopover;