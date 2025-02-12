import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { type User as UserType } from "@supabase/supabase-js";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { LockOpen, LogOut, User, User2 } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return <div className="w-full p-4 flex items-center justify-between gap-2 border-b">
    <span>Rak TLV</span>
    <div className="flex gap-2">
      <ThemeSwitcher />
      <UserPopover user={user} />
    </div>
  </div>
}


const UserPopover = ({ user }: { user: UserType | null }) => {


  if (!user) return <div className="flex gap-2">
    <Button asChild size="sm" variant={"outline"}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
    <Button asChild size="sm" variant={"default"}>
      <Link href="/sign-up">Sign up</Link>
    </Button>
  </div>



  return <Popover>
    <PopoverTrigger asChild>
      <Button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl">
        {user?.email ? user.email[0].toUpperCase() : ''}
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" className="mt-2 flex flex-col">
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
          Sign out
        </p>
      </Button>
    </PopoverContent>
  </Popover>
}
