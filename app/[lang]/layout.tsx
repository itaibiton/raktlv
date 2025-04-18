import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
// import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"
import FormComponent from "@/components/form-component";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n-config";
import { Direction } from "radix-ui";
import { Providers } from "@/components/providers/providers.tsx";
import { getDictionary } from "@/get-dictionary";
import { Rubik } from "next/font/google";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: '/favicon.ico',
    // Optional: You can also specify different sizes and types
    // apple: '/apple-icon.png',
    // shortcut: '/shortcut-icon.png',
  },
};



const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-rubik',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export default async function RootLayout({
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

  const isRtl = lang === "he";

  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} dir={isRtl ? "rtl" : "ltr"} className={`${rubik.variable} ${isRtl ? 'rtl' : 'ltr'}`} suppressHydrationWarning>
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
          rel="stylesheet"
        />
        {/* <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"></script> */}
      </head>
      <body dir={isRtl ? "rtl" : "ltr"} className="bg-background text-foreground h-screen">
        <Providers isRtl={isRtl} dictionary={dictionary}>
          <main className="flex flex-col items-center h-full">
            <div className="flex w-full h-full overflow-hidden ">
              {children}
            </div>
          </main>
          <Toaster position={isRtl ? "bottom-left" : "bottom-right"} />
        </Providers>

      </body>
    </html>
  );
}
