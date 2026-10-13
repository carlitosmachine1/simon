import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteLogo } from './SiteLogo';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#DDE1DF] pt-8 pb-14 text-xs sm:text-sm text-[#687078]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-[#252A2E] font-bold text-sm sm:text-base">
              <SiteLogo size="sm" />
              <span>{t.footerCopyright}</span>
            </div>
            <p className="text-[#687078] leading-relaxed max-w-md text-xs sm:text-sm">
              {t.footerDisclaimer}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#252A2E] text-xs sm:text-sm">{t.navSources}</div>
            <ul className="space-y-1 text-xs sm:text-sm text-[#687078]">
              <li>
                <a
                  href="https://smn.conagua.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] flex items-center gap-1"
                >
                  SMN / Conagua <ExternalLink className="w-3 h-3 stroke-[1.75]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhc.noaa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] flex items-center gap-1"
                >
                  NOAA National Hurricane Center <ExternalLink className="w-3 h-3 stroke-[1.75]" />
                </a>
              </li>
              <li>
                <a
                  href="https://refugios-proteccioncivil.col.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] flex items-center gap-1"
                >
                  Protección Civil Colima <ExternalLink className="w-3 h-3 stroke-[1.75]" />
                </a>
              </li>
              <li>
                <a
                  href="https://proteccioncivil.jalisco.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] flex items-center gap-1"
                >
                  Protección Civil Jalisco <ExternalLink className="w-3 h-3 stroke-[1.75]" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#252A2E] text-xs sm:text-sm">{t.directory911}</div>
            <div className="text-xs sm:text-sm text-[#687078] space-y-1">
              <div>Emergencias Nacional: <strong className="text-[#B84A45]">911</strong></div>
              <div>Cruz Roja Mexicana: <strong className="text-[#252A2E]">065</strong></div>
              <div>CFE Fallas de Energía: <strong className="text-[#245A66]">071</strong></div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DDE1DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#687078]">
          <div>{t.footerSyncNotice}</div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-tabular">© 2026 • Monitor Pacífico</span>
            <span className="text-[#DDE1DF] hidden sm:inline">•</span>
            <div className="text-xs text-[#252A2E]">
              {t.footerDevelopedBy}{' '}
              <a
                href="mailto:martesdetianguis@gmail.com"
                className="font-bold text-[#245A66] hover:text-[#1D4852] underline underline-offset-2 transition"
                title="martesdetianguis@gmail.com"
              >
                CARLITOS MACHINE
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
