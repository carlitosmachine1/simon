import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#DDE1DF] pt-8 pb-14 text-xs text-[#687078]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-[#252A2E] font-semibold text-sm">
              <span className="w-6 h-6 rounded-[3px] bg-[#245A66] text-white flex items-center justify-center text-xs font-bold">
                S4
              </span>
              <span>Portal Meteorológico • Huracán Simón</span>
            </div>
            <p className="text-[#687078] leading-relaxed max-w-md text-xs">
              Herramienta informativa diseñada bajo estándares de análisis y datos meteorológicos abiertos. 
              Orientada a la consulta técnica, localización de albergues y prevención ciudadana en costas del Pacífico mexicano.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#252A2E] text-xs">Organismos Fuentes</div>
            <ul className="space-y-1 text-xs text-[#687078]">
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
            <div className="font-semibold text-[#252A2E] text-xs">Líneas de Atención</div>
            <div className="space-y-0.5 text-xs">
              <div>Emergencias: <strong className="text-[#252A2E] font-tabular">911</strong></div>
              <div>CFE Fallas: <strong className="text-[#252A2E] font-tabular">071</strong></div>
              <div>Guardia Nacional: <strong className="text-[#252A2E] font-tabular">088</strong></div>
              <div className="text-[11px] text-[#687078] pt-1">
                Servicios gratuitos disponibles las 24 horas.
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DDE1DF] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#687078]">
          <div>
            Procesamiento y representación de datos públicos de NOAA STAR NESDIS, SMN y Unidades Estatales de Protección Civil.
          </div>
          <div>
            Centro No oficial pero si fuentes oficiales
          </div>
        </div>
      </div>
    </footer>
  );
};
