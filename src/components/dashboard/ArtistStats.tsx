import React from 'react';
import { CreditCard, CheckCircle, Image, Clock } from 'lucide-react';
import type { Artwork } from '@/lib/sampleArtworks';

type Props = { artworks: Artwork[] };

export function ArtistStats({ artworks }: Props) {
  const total = artworks.length;
  const approved = artworks.filter(a => a.status === 'approved').length;
  const pending = artworks.filter(a => a.status === 'pending').length;
  const income = artworks.reduce((s, a) => s + (a.income || 0), 0);

  const statClass = 'bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-center gap-4';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className={statClass}>
        <div className="p-3 bg-emerald-50 rounded-lg">
          <Image className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Artworks</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{total}</div>
        </div>
      </div>

      <div className={statClass}>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Pending</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pending}</div>
        </div>
      </div>

      <div className={statClass}>
        <div className="p-3 bg-emerald-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Approved</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{approved}</div>
        </div>
      </div>

      <div className={statClass}>
        <div className="p-3 bg-indigo-50 rounded-lg">
          <CreditCard className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Income</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">${income.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default ArtistStats;
