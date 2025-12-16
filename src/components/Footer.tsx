// components/Footer.tsx
"use client";
import { useI18n } from '@/lib/i18nClient';
export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="w-full bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-white/10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-serif text-gray-900 dark:text-[#DFDFD6] mb-4">{t('brand.name')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('footer.about')}
            </p>
            
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-[#DFDFD6] mb-4 uppercase tracking-wider">{t('footer.shop')}</h4>
            <ul className="space-y-2">
              <li><a href="/gallery" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.all_artworks')}</a></li>
              <li><a href="/gallery?category=painting" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.paintings')}</a></li>
              <li><a href="/gallery?category=photography" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.photography')}</a></li>
              <li><a href="/gallery?category=sculpture" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.sculpture')}</a></li>
              <li><a href="/artists" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.featured_artists')}</a></li>
              <li><a href="/collections" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.collections')}</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-[#DFDFD6] mb-4 uppercase tracking-wider">{t('footer.customer_service')}</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.about_us')}</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.contact')}</a></li>
              <li><a href="/shipping" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.shipping_returns')}</a></li>
              <li><a href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.faq')}</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">{t('footer.support')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.copyright_full', { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">
                {t('footer.privacy_policy')}
              </a>
              <a href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-[#DFDFD6] transition-colors">
                {t('footer.terms_of_service')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}