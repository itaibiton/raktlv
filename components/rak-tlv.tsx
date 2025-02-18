'use client';

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const RakTLVLogo = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // During server-side rendering or before mounting, use a default logo
    if (!mounted) {
        return (
            <Image
                className="h-full w-auto object-contain"
                src="/assets/logos/png/1x/logo.png"
                alt="raktlv.png"
                width="203"
                height="40"
            />
        );
    }

    const logosrc = `/assets/logos/png/1x/logo${theme === 'light' ? '-light' : ''}.png`;

    return (
        <Image
            className="h-full w-auto object-contain"
            src={logosrc}
            alt="raktlv.png"
            width="203"
            height="40"
        />
    );
}

export default RakTLVLogo;