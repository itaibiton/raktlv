import HeaderAuth from "@/components/header-auth";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { createClient } from "@/utils/supabase/server";



export default async function Layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}>) {
    const { lang } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const dictionary = await getDictionary(lang);

    return (
        <main className="flex flex-col items-center h-full w-full">
            <HeaderAuth dictionary={dictionary} />
            <div className="flex w-full h-full p-8 overflow-hidden">
                {children}
            </div>
        </main>
    );
}
