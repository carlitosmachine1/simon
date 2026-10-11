import React, { useState, useEffect } from 'react';
import { EMERGENCY_KIT_ITEMS } from '../data/hurricaneData';
import {
  Briefcase,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'simon_emergency_kit_checks_v1';

export const EmergencyKit: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    if (window.confirm('¿Desea reiniciar la lista de la mochila de emergencia?')) {
      setCheckedIds([]);
    }
  };

  const completedCount = checkedIds.length;
  const totalCount = EMERGENCY_KIT_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <section id="mochila" className="space-y-4">
      <div className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[6px] p-5 shadow-none space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DF] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[#245A66] font-semibold text-xs uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 stroke-[1.75]" />
              Preparación Familiar Preventiva
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#252A2E] mt-0.5">
              Mochila de Emergencia de 72 Horas
            </h2>
            <p className="text-xs text-[#687078] mt-0.5 max-w-2xl">
              Artículos prioritarios para autosuficiencia durante las primeras 72 horas. La selección se guarda en su navegador.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right text-xs">
              <span className="text-[#687078]">Completado: </span>
              <span className="font-semibold text-[#252A2E] font-tabular">
                {completedCount} de {totalCount} ({progressPercent}%)
              </span>
            </div>
            {completedCount > 0 && (
              <button
                onClick={handleReset}
                className="bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#687078] hover:text-[#252A2E] text-xs p-1.5 rounded-[4px] border border-[#DDE1DF] transition"
                title="Reiniciar lista"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            )}
          </div>
        </div>

        {/* Fine Horizontal Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#DDE1DF] h-1.5 rounded-[1px] overflow-hidden">
            <div
              className="bg-[#3F8063] h-1.5 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {EMERGENCY_KIT_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer rounded-[4px] p-3 border transition select-none flex items-start gap-2.5 ${
                  isChecked
                    ? 'bg-[#3F8063]/5 border-[#3F8063]/30'
                    : 'bg-[#F7F7F4] border-[#DDE1DF] hover:border-[#687078]/40'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-[#245A66] focus:outline-none"
                  aria-label={isChecked ? 'Desmarcar' : 'Marcar'}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#3F8063] stroke-[2]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#687078] stroke-[1.5]" />
                  )}
                </button>

                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-medium text-[#687078] bg-white border border-[#DDE1DF] px-1 py-0.2 rounded-[2px]">
                    {item.category}
                  </span>
                  <h4
                    className={`text-xs font-semibold leading-tight ${
                      isChecked ? 'line-through text-[#687078]' : 'text-[#252A2E]'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#687078] leading-tight">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
