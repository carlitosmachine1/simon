import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/hurricaneData';
import { Phone, X, ShieldAlert, AlertTriangle } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Directorio de Emergencia</h3>
              <div className="text-xs text-slate-400">Líneas de auxilio y reporte 24/7</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong>En riesgo inminente a la vida o atrapamiento:</strong> Llame de inmediato al{' '}
            <strong className="text-white underline">911</strong>. En caso de cables caídos o chispas, marque al{' '}
            <strong className="text-white underline">071 (CFE)</strong>.
          </div>
        </div>

        <div className="space-y-2">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs sm:text-sm truncate">
                    {contact.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                    {contact.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{contact.description}</p>
              </div>

              <a
                href={`tel:${contact.number}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contact.formatted || contact.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl transition"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
