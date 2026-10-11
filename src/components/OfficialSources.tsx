import React from 'react';
import { OFFICIAL_SOURCES } from '../data/hurricaneData';
import {
  ExternalLink,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const OfficialSources: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="fuentes" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="border-b border-[#DDE1DF] pb-3">
          <div className="flex items-center gap-2 text-[#245A66] font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 stroke-[2]" />
            {t.sourcesBadge}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#252A2E] mt-1">
            {t.sourcesTitle}
          </h2>
          <p className="text-sm text-[#687078] mt-1 max-w-2xl">
            {t.sourcesSubtitle}
          </p>
        </div>

        {/* Notice */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 flex items-start gap-2.5 text-xs sm:text-sm text-[#252A2E]">
          <AlertTriangle className="w-4 h-4 text-[#A66C19] shrink-0 mt-0.5 stroke-[2]" />
          <div>
            <strong>{language === 'en' ? 'Verification Criterion:' : 'Criterio de Veracidad:'}</strong>{' '}
            {language === 'en'
              ? 'Avoid forwarding unverified chain messages. Rely only on official bulletins from the National Hurricane Center, SMN CONAGUA, and Civil Protection.'
              : 'Evite compartir mensajes en cadena no respaldados por boletines formales de la Coordinación Nacional de Protección Civil o el Servicio Meteorológico Nacional.'}
          </div>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_SOURCES.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F7F7F4] border border-[#DDE1DF] hover:border-[#245A66] rounded-[4px] p-4 flex flex-col justify-between transition group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-white border border-[#DDE1DF] text-[#245A66]">
                    {source.badge} • {source.country}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#687078] group-hover:text-[#245A66] transition" />
                </div>

                <h3 className="text-sm font-bold text-[#252A2E] group-hover:text-[#245A66] transition mb-0.5 leading-snug">
                  {source.name}
                </h3>

                <div className="text-xs text-[#687078] mb-1.5">
                  {source.agency}
                </div>

                <p className="text-xs text-[#687078] leading-relaxed line-clamp-3">
                  {source.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#DDE1DF] flex items-center justify-between text-xs font-bold text-[#245A66]">
                <span>{t.visitPortal}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
