import React from 'react';
import { OFFICIAL_SOURCES } from '../data/hurricaneData';
import {
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building,
  Globe,
  Radio,
  FileText,
} from 'lucide-react';

export const OfficialSources: React.FC = () => {
  return (
    <section id="fuentes" className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Fuentes de Veracidad y Boletines Oficiales
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Canales Verificados de Información
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            En emergencias hidrometeorológicas mayores, evite compartir rumores o cadenas no verificadas en redes sociales.
            Consulte directamente los comunicados oficiales de las autoridades mexicanas e internacionales.
          </p>
        </div>

        {/* Anti-misinformation Callout */}
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3 mb-5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200">
            <strong className="text-amber-300 font-bold">Aviso contra la Desinformación:</strong>{' '}
            Las órdenes de evacuación, apertura de refugios y suspensión de clases solo son válidas cuando son emitidas por{' '}
            <strong>Protección Civil del Estado, los Gobiernos Estatales/Municipales o el SMN / Conagua</strong>.
          </div>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {OFFICIAL_SOURCES.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 rounded-xl p-4 flex flex-col justify-between transition shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      source.badge === 'Oficial'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : source.badge === 'Científico'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {source.badge} • {source.country}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition mb-1 leading-snug">
                  {source.name}
                </h3>

                <div className="text-[11px] text-slate-400 font-medium mb-2">
                  {source.agency}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {source.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                {source.handle && (
                  <span className="text-slate-400 font-mono">{source.handle}</span>
                )}
                <span className="text-emerald-400 font-semibold ml-auto">
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
