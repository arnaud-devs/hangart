import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";

// Read translations from public/locales. If `locale` is not provided, try to
// read the user's preferred locale from the `lang` cookie. Falls back to 'rw'.
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

  if (!lang) lang = "rw"; // default locale

  const filePath = path.join(process.cwd(), "public", "locales", lang, "common.json");
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    // fallback to default (rw)
    const fallback = path.join(process.cwd(), "public", "locales", "rw", "common.json");
    const raw = await fs.readFile(fallback, "utf8");
    return JSON.parse(raw);
  }
}
