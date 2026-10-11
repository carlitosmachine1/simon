import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/hurricaneData';
import { Phone, X, AlertTriangle } from 'lucide-react';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#252A2E]/50 flex items-center justify-center p-4 transition"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DDE1DF] max-w-lg w-full rounded-[6px] p-5 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DDE1DF] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[3px] bg-[#B84A45] text-white flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#252A2E] text-sm">Directorio Telefónico de Auxilio</h3>
              <div className="text-[11px] text-[#687078]">Líneas de reporte y atención continua 24 horas</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[3px] text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#B84A45]/8 border border-[#B84A45]/20 rounded-[4px] p-2.5 text-xs text-[#252A2E]">
          <strong>Riesgo inmediato a la vida:</strong> Comuníquese al <span className="font-semibold text-[#B84A45]">911</span>. Para cables eléctricos derribados, marque al <span className="font-semibold text-[#245A66]">071 (CFE)</span>.
        </div>

        <div className="space-y-1.5">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-2.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#252A2E] text-xs truncate">
                    {contact.name}
                  </span>
                  <span className="text-[9px] uppercase font-medium text-[#687078] bg-white border border-[#DDE1DF] px-1 rounded-[2px] shrink-0">
                    {contact.type}
                  </span>
                </div>
                <p className="text-[11px] text-[#687078] truncate">{contact.description}</p>
              </div>

              <a
                href={`tel:${contact.number}`}
                className="bg-[#245A66] hover:bg-[#1b434c] text-white font-medium text-xs px-2.5 py-1.5 rounded-[3px] flex items-center gap-1 shrink-0 transition"
              >
                <Phone className="w-3 h-3 stroke-[2]" />
                <span className="font-tabular">{contact.formatted || contact.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#DDE1DF] text-center">
          <button
            onClick={onClose}
            className="w-full bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] text-xs font-medium py-1.5 rounded-[4px] transition"
          >
            Cerrar Directorio
          </button>
        </div>
      </div>
    </div>
  );
};
