'use client';

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const darkLogoURL = `https://dxohrymifwxwyppgvmff.supabase.co/storage/v1/object/public/assets//logo.png`
const lightLogoURL = `https://dxohrymifwxwyppgvmff.supabase.co/storage/v1/object/public/assets//logo-light.png`

const RakTLVLogo = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [logoURL, setLogoURL] = useState('');
    useEffect(() => {
        setMounted(true);
    }, []);


    useEffect(() => {
        setLogoURL(theme === 'dark' ? darkLogoURL : theme === 'light' ? lightLogoURL : lightLogoURL);
    }, [theme]);

    // During server-side rendering or before mounting, use a placeholder
    if (!mounted) {
        return (
            <div
                className="h-[40px] w-[180px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                aria-label="Loading logo"
            />
        );
    }


    return (
        <Image
            className="h-full w-auto object-contain"
            src={logoURL}
            alt="raktlv.png"
            width="180"
            height="40"
        />
    );
}

export default RakTLVLogo;