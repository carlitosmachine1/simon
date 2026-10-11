import React from 'react';
import { OFFICIAL_SOURCES } from '../data/hurricaneData';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export const OfficialSources: React.FC = () => {
  return (
    <section id="fuentes" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="border-b border-[#DDE1DF] pb-3">
          <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 stroke-[1.75]" />
            Verificación y Fuentes de Información
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#252A2E] mt-0.5">
            Canales Oficiales y Organismos Técnicos
          </h2>
          <p className="text-xs text-[#687078] mt-0.5 max-w-2xl">
            Directorio de organismos gubernamentales y científicos que emiten boletines hidrometeorológicos y avisos de protección civil.
          </p>
        </div>

        {/* Notice */}
        <div className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 flex items-start gap-2.5 text-xs text-[#252A2E]">
          <AlertTriangle className="w-4 h-4 text-[#A66C19] shrink-0 mt-0.5 stroke-[1.75]" />
          <div>
            <strong>Criterio de Veracidad:</strong> Evite compartir mensajes en cadena no respaldados por boletines formales de la Coordinación Nacional de Protección Civil, el Servicio Meteorológico Nacional o las Unidades Estatales de Protección Civil.
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
              className="bg-[#F7F7F4] border border-[#DDE1DF] hover:border-[#245A66]/40 rounded-[4px] p-3.5 flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-white border border-[#DDE1DF] text-[#245A66]">
                    {source.badge} • {source.country}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#687078] group-hover:text-[#245A66] transition" />
                </div>

                <h3 className="text-xs font-semibold text-[#252A2E] group-hover:text-[#245A66] transition mb-0.5 leading-snug">
                  {source.name}
                </h3>

                <div className="text-[11px] text-[#687078] mb-1.5">
                  {source.agency}
                </div>

                <p className="text-xs text-[#687078] leading-relaxed">
                  {source.description}
                </p>
              </div>

              <div className="pt-2.5 mt-2 border-t border-[#DDE1DF] flex items-center justify-between text-[11px] text-[#687078]">
                {source.handle && (
                  <span className="font-mono text-[#252A2E]">{source.handle}</span>
                )}
                <span className="text-[#245A66] font-medium ml-auto">
                  {source.updatedInterval}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
