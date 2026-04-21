

"use client";

import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/src/i18n/config";
import { useLanguageStore } from "@/src/store/language-store";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="relative flex items-center">
      <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-white/60" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="appearance-none rounded-xl border border-white/20 bg-white/5 pl-8 pr-3 py-2 text-sm text-white/80 outline-none hover:bg-white/10 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
        aria-label="Select language"
      >
        {SUPPORTED_LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} className="bg-slate-900 text-white">
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}