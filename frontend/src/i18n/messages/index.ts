
import { en } from "./en";
import { sw } from "./sw";
import { fr } from "./fr";
import { zhCN } from "./zh-CN";
import { de } from "./de";
import { ar } from "./ar";
import { es } from "./es";   // ← was la
import { pt } from "./pt";
import type { LanguageCode } from "@/src/i18n/config";

type Messages = typeof en;

export const messagesByLanguage: Record<LanguageCode, Messages> = {
  en,
  sw,
  fr,
  "zh-CN": zhCN,
  de,
  ar,
  es,   // ← was la
  pt,
};



// import { en } from "./en";
// import { sw } from "./sw";
// import { fr } from "./fr";
// import { zhCN } from "./zh-CN";
// import { de } from "./de";
// import { ar } from "./ar";
// import { es } from "./es";
// import { pt } from "./pt";
// import type { LanguageCode } from "@/src/i18n/config";

// type Messages = typeof en;

// export const messagesByLanguage: Record<LanguageCode, Messages> = {
//   en,
//   sw,
//   fr,
//   "zh-CN": zhCN,
//   de,
//   ar,
//   es,
//   pt,
// };