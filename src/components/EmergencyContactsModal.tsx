import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/hurricaneData';
import { Phone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#252A2E]/50 flex items-center justify-center p-4 transition animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DDE1DF] max-w-lg w-full rounded-[6px] p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DDE1DF] pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#B84A45] text-white flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-[#252A2E] text-base">{t.contactsTitle}</h3>
              <div className="text-xs text-[#687078]">{t.contactsSubtitle}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4] transition cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#B84A45]/10 border border-[#B84A45]/25 rounded-[4px] p-3 text-xs sm:text-sm text-[#252A2E]">
          {language === 'en' ? (
            <>
              <strong>Immediate threat to life:</strong> Dial{' '}
              <span className="font-bold text-[#B84A45]">911</span>. For downed power lines, call{' '}
              <span className="font-bold text-[#245A66]">071 (CFE)</span>.
            </>
          ) : (
            <>
              <strong>Riesgo inmediato a la vida:</strong> Comuníquese al{' '}
              <span className="font-bold text-[#B84A45]">911</span>. Para cables eléctricos caídos, marque al{' '}
              <span className="font-bold text-[#245A66]">071 (CFE)</span>.
            </>
          )}
        </div>

        <div className="space-y-2">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div
              key={idx}
              className="bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#252A2E] text-xs sm:text-sm truncate">
                    {contact.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#687078] bg-white border border-[#DDE1DF] px-1.5 py-0.5 rounded-[3px] shrink-0">
                    {contact.type}
                  </span>
                </div>
                <div className="text-xs text-[#687078] truncate mt-0.5">{contact.description}</div>
              </div>

              <a
                href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                className="bg-[#245A66] hover:bg-[#1D4852] text-white text-xs sm:text-sm font-bold font-tabular px-3 py-1.5 rounded-[4px] shrink-0 transition flex items-center gap-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{contact.formatted || contact.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#DDE1DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-bold text-[#687078] hover:text-[#252A2E] cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
