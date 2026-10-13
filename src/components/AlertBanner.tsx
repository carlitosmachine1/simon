import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ActiveStormSystem } from '../utils/noaaFeed';

interface AlertBannerProps {
  onOpenContacts?: () => void;
  hasActiveCyclone?: boolean;
  activeStormName?: string;
  activeCategory?: number;
  activeStorms?: ActiveStormSystem[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  hasActiveCyclone = true,
  activeStormName,
  activeCategory,
  activeStorms,
}) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  if (!hasActiveCyclone) {
    return (
      <div className="bg-emerald-500/10 border-b border-emerald-500/25 text-[#252A2E] px-4 sm:px-6 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-emerald-800 mr-1.5 uppercase text-xs tracking-wide">
                {t.alertGreenTitle}:
              </span>
              <span className="text-[#252A2E] font-medium">
                {t.alertGreenBannerText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#mapa-viento-zoom"
              className="text-xs font-bold text-[#245A66] hover:underline flex items-center gap-0.5"
            >
              <span>{t.navWind}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  let stormLabel = t.alertRed;
  if (activeStorms && activeStorms.length > 1) {
    const names = activeStorms.map((s) => s.cleanDisplayName).join(isEn ? ' & ' : ' y ');
    stormLabel = isEn
      ? `Precaution Advisory • ${activeStorms.length} Active Systems in Pacific: ${names}`
      : `Aviso de Precaución • ${activeStorms.length} Sistemas Activos en el Pacífico: ${names}`;
  } else if (activeStorms && activeStorms.length === 1) {
    const single = activeStorms[0];
    stormLabel = `${isEn ? 'Precaution Advisory • ' : 'Aviso de Precaución • '}${single.cleanDisplayName} (${isEn ? single.typeLabelEn : single.typeLabelEs})`;
  } else if (activeStormName) {
    const categoryLabel =
      activeCategory !== undefined && activeCategory > 0 ? `(Cat. ${activeCategory})` : '';
    stormLabel = `${isEn ? 'Precaution Advisory • ' : 'Aviso de Precaución • '}${activeStormName} ${categoryLabel}`;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-[#252A2E] px-4 sm:px-6 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
          <div className="truncate">
            <span className="font-bold text-amber-800 mr-1.5 uppercase text-xs tracking-wide">
              {stormLabel}:
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
