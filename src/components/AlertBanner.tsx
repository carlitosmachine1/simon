import React from 'react';
import { AlertCircle, ChevronRight, Phone } from 'lucide-react';

interface AlertBannerProps {
  onOpenContacts: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ onOpenContacts }) => {
  return (
    <div className="bg-[#B84A45]/8 border-b border-[#B84A45]/25 text-[#252A2E] px-4 sm:px-6 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B84A45] shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-[#B84A45] mr-1.5 uppercase text-[11px] tracking-wide">
              Aviso Meteorológico:
            </span>
            <span className="text-[#252A2E]">
              Huracán Simón (Cat. 4) en aproximación a costas de Colima y Jalisco. Refugios temporales habilitados.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#refugios"
            className="text-[11px] font-medium text-[#245A66] hover:underline flex items-center gap-0.5"
          >
            <span>Consultar refugios</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
