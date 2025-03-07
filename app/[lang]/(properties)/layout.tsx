import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";



export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();


    return (
        <main className="flex flex-col items-center h-full">
            <HeaderAuth />
            <div className="flex w-full h-full p-8 overflow-hidden ">
                {children}
            </div>
        </main>
    );
}
