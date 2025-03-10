"use client";

import { Direction } from "radix-ui";
import { ThemeProvider } from "next-themes";
import { Dictionary } from "@/get-dictionary";
import { createContext, useContext } from "react";

export const DictionaryContext = createContext<any>(null);


// Create a hook to use the dictionary
export const useDictionary = () => {
    const dictionary = useContext(DictionaryContext);
    if (!dictionary) {
        throw new Error("useDictionary must be used within a DictionaryProvider");
    }
    return dictionary;
};

export const Providers = ({ children, isRtl, dictionary }: { children: React.ReactNode, isRtl: boolean, dictionary: Dictionary }) => {
    return <>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <DictionaryContext.Provider value={dictionary}>
                <Direction.Provider dir={isRtl ? "rtl" : "ltr"}>{children}</Direction.Provider>
            </DictionaryContext.Provider>
        </ThemeProvider>
    </>

};
