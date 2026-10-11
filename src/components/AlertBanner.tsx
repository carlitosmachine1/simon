import React from 'react';
import { Phone, ShieldCheck, ChevronRight } from 'lucide-react';

interface AlertBannerProps {
  onOpenContacts: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ onOpenContacts }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-700/80 text-slate-100 px-3 py-2 text-xs sm:text-sm sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <div className="truncate text-xs sm:text-sm">
            <span className="font-bold text-amber-300 mr-2">
              BOLETÍN INFORMATIVO OFICIAL:
            </span>
            <span className="text-slate-200">
              Huracán Simón (Cat. 4) en aproximación costera. Refugios temporales activos en Jalisco, Colima y Nayarit.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#localizador-refugios"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            <span>Buscar mi refugio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenContacts}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition active:scale-95"
          >
            <Phone className="w-3 h-3 text-sky-400" />
            <span>Directorio 911</span>
          </button>
        </div>
      </div>
    </div>
  );
};
