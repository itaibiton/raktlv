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
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toggle } from "./ui/toggle";

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <Toggle
      className={clsx("relative h-8 w-14 border px-1 rounded-full", className)}
      pressed={theme === "dark"}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun size={ICON_SIZE} className={clsx("text-yellow-500", theme === "dark" && "opacity-50")} />
        <Moon size={ICON_SIZE} className={clsx("text-blue-500", theme === "light" && "opacity-50")} />
      </div>
      <div
        className={clsx(
          "absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200",
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        )}
      />
    </Toggle>
  );

  // return <Button variant="outline" size="icon" className="rounded-full" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  //   {theme === 'light' ? <Sun
  //     key="light"
  //     size={ICON_SIZE}
  //     className={"text-muted-foreground"}
  //   />
  //     :
  //     <Moon
  //       key="dark"
  //       size={ICON_SIZE}
  //       className={"text-muted-foreground"}
  //     />
  //   }
  // </Button>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={clsx('', className)}>
        <Button variant="ghost" size={"sm"}>
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className={"text-muted-foreground"}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
