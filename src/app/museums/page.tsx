"use client";

import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18nClient';
import MuseumAdCard from '@/components/dashboard/MuseumAdCard';
import sampleMuseumAds from '@/data/sampleMuseumAds';

type Ad = {
  id: string;
  museumName: string;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  createdAt?: string;
};

const STORAGE_KEY = 'museumAds';

export default function Page() {
  const [ads, setAds] = useState<Ad[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Ad[] = raw ? JSON.parse(raw) : [];
      // merge sample ads with custom saved ads; custom ads are prioritized
      const map = new Map<string, Ad>();
      [...list, ...sampleMuseumAds].forEach(a => map.set(a.id, a));
      setAds(Array.from(map.values()));
    } catch (e) {
      setAds([]);
    }
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('museums.title')}</h1>
        <p className="text-sm text-gray-500 mb-6">{t('museums.subtitle')}</p>

        {ads.length === 0 ? (
          <div className="text-sm text-gray-500">{t('museums.none')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map(a => (
              <MuseumAdCard key={a.id} ad={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
