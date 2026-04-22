
import { en } from "./en";
import { sw } from "./sw";
import { fr } from "./fr";
import { zhCN } from "./zh-CN";
import { de } from "./de";
import { ar } from "./ar";
import { es } from "./es";
import { pt } from "./pt";
import type { LanguageCode } from "@/src/i18n/config";

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

type Messages = DeepStringRecord<typeof en>;

export const messagesByLanguage: Record<LanguageCode, Messages> = {
  en,
  sw,
  fr,
  "zh-CN": zhCN,
  de,
  ar,
  es,
  pt,
};

