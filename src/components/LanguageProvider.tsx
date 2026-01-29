"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDictionary, getDictionaryValue, SupportedLanguage, supportedLanguages, TranslationDict } from "@/i18n/dictionaries";

interface LanguageContextValue {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    t: (key: string, fallback?: string) => string;
    dictionary: TranslationDict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "nm_lang";
const DEFAULT_LANG: SupportedLanguage = "th";

function detectInitialLanguage(): SupportedLanguage {
    if (typeof window === "undefined") return DEFAULT_LANG;

    const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (stored && supportedLanguages.some(l => l.code === stored)) return stored;

    const browserLang = navigator.language?.toLowerCase() ?? "";
    if (browserLang.startsWith("th")) return "th";
    if (browserLang.startsWith("zh")) return "zh";
    return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANG);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial = detectInitialLanguage();
        setLanguageState(initial);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.lang = language;
        window.localStorage.setItem(STORAGE_KEY, language);
    }, [language, mounted]);

    const dictionary = useMemo(() => getDictionary(language), [language]);

    const t = useCallback(
        (key: string, fallback?: string) => {
            const value = getDictionaryValue(dictionary, key);
            if (typeof value === "string") return value;

            // Fallback to English dictionary if key missing in current language
            const enValue = getDictionaryValue(getDictionary("en"), key);
            if (typeof enValue === "string") return enValue;

            return fallback ?? key;
        },
        [dictionary]
    );

    const setLanguage = useCallback((lang: SupportedLanguage) => {
        setLanguageState(lang);
    }, []);

    const value = useMemo(() => ({ language, setLanguage, t, dictionary }), [language, setLanguage, t, dictionary]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return ctx;
}
