import React from "react";
import { getTranslations } from "../../lib/i18n";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: any }) {
  // In Next 16 the `params` may be a Promise; unwrap it before accessing properties.
  const resolvedParams = await params;
  const t = await getTranslations(resolvedParams?.locale);

  return (
    <div>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-3">
      </div>
      {children}
    </div>
  );
}
