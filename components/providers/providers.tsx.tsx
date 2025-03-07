"use client";

import { Direction } from "radix-ui";
import { ThemeProvider } from "next-themes";


export const Providers = ({ children, isRtl }: { children: React.ReactNode, isRtl: boolean }) => {
    return <>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Direction.Provider dir={isRtl ? "rtl" : "ltr"}>{children}</Direction.Provider>
        </ThemeProvider>
    </>

};
