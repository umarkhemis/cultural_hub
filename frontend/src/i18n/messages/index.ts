
import { en } from "./en";
import { sw } from "./sw";
import { fr } from "./fr";
import { zhCN } from "./zh-CN";
import { de } from "./de";
import { ar } from "./ar";
import { es } from "./es";   // ← was la
import { pt } from "./pt";
import type { LanguageCode } from "@/src/i18n/config";

export const messagesByLanguage: Record<LanguageCode, any> = {
  en,
  sw,
  fr,
  "zh-CN": zhCN,
  de,
  ar,
  es,   // ← was la
  pt,
};