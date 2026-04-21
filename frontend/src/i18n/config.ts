
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "fr", label: "Français" },
  { code: "zh-CN", label: "中文" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
  { code: "es", label: "Español" },   // ← was "la"
  { code: "pt", label: "Português" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isRtlLanguage(language: LanguageCode) {
  return language === "ar";
}