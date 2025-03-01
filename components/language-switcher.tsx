"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { i18n, Locale } from "@/i18n-config";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const ICON_SIZE = 16;

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
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

  // Handle locale change
  const handleLocaleChange = (newLocale: string) => {
    // Get the path without the locale prefix
    const segments = pathname.split('/');
    const pathWithoutLocale = segments.slice(2).join('/');

    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`);
  };

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger customTrigger={<Button variant="outline" size="icon" className="rounded-full">
        <Globe size={ICON_SIZE} />
      </Button>}>
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale === 'he' ? 'עברית' : 'English'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { LanguageSwitcher };
