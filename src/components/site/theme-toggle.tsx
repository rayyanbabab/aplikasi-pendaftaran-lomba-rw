"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button type="button" variant="ghost" size="icon" aria-label="Toggle tema">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const activeTheme = resolvedTheme ?? theme;
  const isDark = activeTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function SidebarThemeSwitch() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1 text-xs font-bold text-muted-foreground border border-border/40 animate-pulse">
        <div className="flex items-center justify-center gap-1.5 py-1.5 border border-transparent leading-none">
          <Sun className="h-3.5 w-3.5" />
          <span>Terang</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-1.5 border border-transparent leading-none">
          <Moon className="h-3.5 w-3.5" />
          <span>Gelap</span>
        </div>
      </div>
    );
  }

  const activeTheme = resolvedTheme ?? theme;
  const isDark = activeTheme === "dark";

  return (
    <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 text-xs font-bold text-muted-foreground border border-border/60 shadow-inner">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 border leading-none transition-all duration-200 ${
          !isDark
            ? "bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-white border-white/20 shadow-md shadow-primary/25 font-black"
            : "border-transparent hover:text-foreground hover:bg-background/40"
        }`}
      >
        <Sun className={`h-3.5 w-3.5 shrink-0 transition-colors ${!isDark ? "text-white fill-white/20" : "text-amber-500"}`} />
        <span>Terang</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 border leading-none transition-all duration-200 ${
          isDark
            ? "bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] text-white border-white/20 shadow-md shadow-primary/25 font-black"
            : "border-transparent hover:text-foreground hover:bg-background/40"
        }`}
      >
        <Moon className={`h-3.5 w-3.5 shrink-0 transition-colors ${isDark ? "text-white fill-white/20" : "text-red-500"}`} />
        <span>Gelap</span>
      </button>
    </div>
  );
}

export function TextThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="transition-colors duration-200 hover:text-primary cursor-pointer select-none font-bold uppercase tracking-widest text-xs"
      >
        GELAP
      </button>
    );
  }

  const activeTheme = resolvedTheme ?? theme;
  const isDark = activeTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-colors duration-200 hover:text-primary cursor-pointer select-none font-bold uppercase tracking-widest text-xs"
    >
      {isDark ? "TERANG" : "GELAP"}
    </button>
  );
}
