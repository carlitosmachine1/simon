import React from 'react';
import { ShieldCheck, Heart, Radio, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-10 pb-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="text-xl">🌀</span>
              <span>Portal Informativo Huracán Simón (Pacífico Mexicano)</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Plataforma 100% de utilidad pública orientada a salvar vidas, orientar a habitantes de
              zonas de riesgo hidrometeorológico y conectar con refugios temporales y canales de auxilio de Protección Civil.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-slate-200">Organismos Fuentes</div>
            <ul className="space-y-1 text-slate-400">
              <li>
                <a
                  href="https://smn.conagua.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  SMN / Conagua (México) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhc.noaa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  NOAA National Hurricane Center <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://refugios-proteccioncivil.col.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  Protección Civil Colima <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://proteccioncivil.jalisco.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  Protección Civil Jalisco <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-slate-200">Líneas de Vida</div>
            <div className="space-y-1">
              <div>Emergencias: <strong className="text-white">911</strong></div>
              <div>Cables y CFE: <strong className="text-white">071</strong></div>
              <div>Guardia Nacional: <strong className="text-white">088</strong></div>
              <div className="text-[11px] text-slate-500 pt-1">
                Disponible las 24 horas sin costo.
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            Datos meteorológicos generados a partir de los modelos de predicción numérica y boletines de NOAA y Conagua.
          </div>
          <div className="flex items-center gap-1">
            <span>Diseñado para acceso prioritario y alta velocidad en situaciones de emergencia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
