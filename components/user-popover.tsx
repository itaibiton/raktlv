'use client'

import { Dictionary } from "@/get-dictionary";
import { useRtl } from "@/hooks/useRtl";
import { Button } from "./ui/button";
import { type User as UserType } from "@supabase/supabase-js";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { User2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { signOutAction } from "@/app/actions";
import { LogOut } from "lucide-react";
const UserPopover = ({ user, dictionary }: { user: UserType | null, dictionary: Dictionary }) => {

    const { isRtl } = useRtl();

    if (!user) return <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">{dictionary['auth'].signIn}</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">{dictionary['auth'].signUp}</Link>
        </Button>
    </div>

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
            <Separator className="my-2" />
            <Button onClick={signOutAction} variant="ghost" className="flex gap-2 items-center justify-start w-full" size={"sm"}>
                <LogOut className="w-4 h-4" />
                <p className="">
                    {dictionary['auth'].signOut}
                </p>
            </Button>
        </PopoverContent>
    </Popover>
}

export default UserPopover;