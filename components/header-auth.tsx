import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import RakTLVLogo from "./rak-tlv";
import { Dictionary } from "@/get-dictionary";
import UserPopover from "./user-popover";
import CreatePropertyForm from "./create-property-button";


export default async function HeaderAuth({ dictionary }: { dictionary: Dictionary }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log('dictionary', dictionary);

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
              <Link href="/sign-in">{dictionary['auth'].signIn}</Link>
            </Button>
            {/* <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">{dictionary['auth'].signUp}</Link>
            </Button> */}
          </div>
        </div>
      </>
    );
  }
  return <div className="w-full p-8 flex items-center justify-between gap-2 border-b rtl:flex-row-reverse">
    <div className="h-12">
      <RakTLVLogo />
    </div>
    <div className="flex gap-2 h-12 ltr:flex-row-reverse">
      <UserPopover user={user} dictionary={dictionary} />
      {user && <CreatePropertyForm />}
      {/* {!user && <AuthDialog />} */}
      {/* <ThemeSwitcher /> */}
      {/* <LanguageSwitcher /> */}
    </div>
  </div>
}



