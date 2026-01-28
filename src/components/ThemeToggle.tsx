"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9 rounded-xl border border-transparent" />; // Placeholder to prevent layout shift
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Moon size={18} className="transition-all" />
            ) : (
                <Sun size={18} className="transition-all text-amber-400" />
            )}
        </button>
    );
}
