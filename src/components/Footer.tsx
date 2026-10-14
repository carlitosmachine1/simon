import React from 'react';
import { ExternalLink, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteLogo } from './SiteLogo';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  return (
    <footer
      id="fuentes"
      className="bg-[#FFFFFF] border-t border-[#DDE1DF] pt-10 pb-12 sm:pb-16 text-xs sm:text-sm text-[#687078]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1 y 2: Identidad y Declaración Civil */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-[#252A2E] font-bold text-base sm:text-lg">
              <SiteLogo size="sm" className="shrink-0" />
              <span>Monitor Pacífico</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-lg">
              {t.footerDisclaimer}
            </p>
            <p className="text-xs text-[#687078] leading-relaxed max-w-lg">
              {t.footerSyncNotice}
            </p>
          </div>

          {/* Columna 3: Fuentes Oficiales y Enlaces de Consulta */}
          <div className="space-y-3">
            <div className="font-bold text-[#252A2E] text-xs sm:text-sm uppercase tracking-wider">
              {t.navSources}
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://smn.conagua.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] transition flex items-center gap-1.5 py-1 min-h-[36px]"
                >
                  <span>SMN / Conagua</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhc.noaa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] transition flex items-center gap-1.5 py-1 min-h-[36px]"
                >
                  <span>NOAA National Hurricane Center</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://refugios-proteccioncivil.col.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] transition flex items-center gap-1.5 py-1 min-h-[36px]"
                >
                  <span>Protección Civil Colima</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://proteccioncivil.jalisco.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#245A66] transition flex items-center gap-1.5 py-1 min-h-[36px]"
                >
                  <span>Protección Civil Jalisco</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Directorio de Auxilio Inmediato (Enlaces Telefónicos Directos) */}
          <div className="space-y-3">
            <div className="font-bold text-[#252A2E] text-xs sm:text-sm uppercase tracking-wider">
              {t.directory911}
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div>
                <span className="text-[#687078] block text-[11px] font-medium">
                  {isEn ? 'National Emergency (Toll-Free 24/7):' : 'Emergencias Nacional (24/7):'}
                </span>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#B84A45] hover:underline py-0.5"
                >
                  <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>911</span>
                </a>
              </div>

              <div>
                <span className="text-[#687078] block text-[11px] font-medium">
                  {isEn ? 'Mexican Red Cross:' : 'Cruz Roja Mexicana:'}
                </span>
                <a
                  href="tel:065"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#252A2E] hover:text-[#245A66] hover:underline py-0.5"
                >
                  <span>065</span>
                </a>
              </div>

              <div>
                <span className="text-[#687078] block text-[11px] font-medium">
                  {isEn ? 'CFE Electric Power Grid Outages:' : 'CFE Fallas de Energía Eléctrica:'}
                </span>
                <a
                  href="tel:071"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245A66] hover:underline py-0.5"
                >
                  <span>071</span>
                </a>
              </div>

              <div>
                <span className="text-[#687078] block text-[11px] font-medium">
                  Conagua / SMN Central:
                </span>
                <a
                  href="tel:5551744000"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#687078] hover:text-[#252A2E] hover:underline py-0.5"
                >
                  <span>55-5174-4000</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Derechos y Créditos (Sin encimarse ni romperse en móviles) */}
        <div className="pt-6 border-t border-[#DDE1DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#687078]">
          <div className="text-[11px] sm:text-xs">
            {isEn
              ? 'Independent civil meteorological & coastal monitoring for the Mexican Pacific basin.'
              : 'Vigilancia meteorológica y costera civil independiente para el Litoral del Pacífico Mexicano.'}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs text-[#252A2E]">
            <span className="font-tabular text-[11px] sm:text-xs">© 2026 Monitor Pacífico</span>
            <span className="text-[#BAC2BF]" aria-hidden="true">
              ·
            </span>
            <span>{t.footerDevelopedBy}</span>
            <a
              href="mailto:martesdetianguis@gmail.com"
              className="font-bold text-[#245A66] hover:text-[#1D4852] underline underline-offset-2 transition"
              title="martesdetianguis@gmail.com"
            >
              CARLITOS MACHINE
            </a>
            <span className="text-[#BAC2BF]" aria-hidden="true">
              ·
            </span>
            <a
              href="mailto:martesdetianguis@gmail.com"
              className="text-[#687078] hover:text-[#252A2E] transition"
            >
              martesdetianguis@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
