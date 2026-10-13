import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AlertBannerProps {
  onOpenContacts: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-[#252A2E] px-4 sm:px-6 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
          <div className="truncate">
            <span className="font-bold text-amber-800 mr-1.5 uppercase text-xs tracking-wide">
              {t.alertRed}:
            </span>
            <span className="text-[#252A2E] font-medium">
              {t.alertBannerText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#refugios"
            className="text-xs font-bold text-[#245A66] hover:underline flex items-center gap-0.5"
          >
            <span>{t.navShelters}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
