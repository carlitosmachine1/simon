import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AlertBannerProps {
  onOpenContacts: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#B84A45]/8 border-b border-[#B84A45]/25 text-[#252A2E] px-4 sm:px-6 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-[#B84A45] shrink-0 animate-pulse" />
          <div className="truncate">
            <span className="font-bold text-[#B84A45] mr-1.5 uppercase text-xs tracking-wide">
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
