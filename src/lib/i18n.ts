import { cookies } from "next/headers";

// Import all translations at build time
import enTranslations from "@/../public/locales/en/common.json";
import frTranslations from "@/../public/locales/fr/common.json";
import rwTranslations from "@/../public/locales/rw/common.json";
import esTranslations from "@/../public/locales/es/common.json";
import zhTranslations from "@/../public/locales/zh/common.json";
import swTranslations from "@/../public/locales/sw/common.json";

const translations: Record<string, any> = {
  en: enTranslations,
  fr: frTranslations,
  rw: rwTranslations,
  es: esTranslations,
  zh: zhTranslations,
  sw: swTranslations,
};

// Read translations from imported JSON. If `locale` is not provided, try to
// read the user's preferred locale from the `lang` cookie. Falls back to 'en'.
export async function getTranslations(locale?: string) {
  let lang = (locale || "").toLowerCase();

  if (!lang) {
    try {
      const cobj = await cookies();
      const c = cobj.get("lang")?.value;
      if (c) lang = c;
    } catch (e) {
      // ignore (cookies only available in server context)
    }
  }

  if (!lang) lang = "en"; // default locale

  // Return the imported translation or fallback to English
  return translations[lang] || translations["en"];
}
