"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { i18n, Locale } from "@/i18n-config";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_SIZE = 16;

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Get current locale from the pathname
  const getCurrentLocale = (): Locale => {
    const segments = pathname.split('/');
    const firstSegment = segments[1];
    return i18n.locales.includes(firstSegment as Locale)
      ? (firstSegment as Locale)
      : i18n.defaultLocale;
  };

  const currentLocale = getCurrentLocale();
  const isRTL = currentLocale === 'he';

  // Toggle between available locales
  const toggleLocale = () => {
    const newLocale = currentLocale === 'en' ? 'he' : 'en';

    // Get the path without the locale prefix
    const segments = pathname.split('/');
    const pathWithoutLocale = segments.slice(2).join('/');

    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
  };

  const displayText = currentLocale === 'he' ? 'HE' : 'EN';

  return (
    <Button
      variant="outline"
      size="icon"
      className={clsx('rounded-full relative overflow-hidden ', className)}
      onClick={toggleLocale}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence initial={false}>
          {!isHovered ? (
            <motion.div
              key="icon"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Globe size={ICON_SIZE} />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              className="absolute inset-0 flex items-center justify-center text-xs font-medium"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {displayText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
};

export { LanguageSwitcher };
