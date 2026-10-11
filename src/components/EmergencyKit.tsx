import React, { useState, useEffect } from 'react';
import { EMERGENCY_KIT_ITEMS } from '../data/hurricaneData';
import {
  Briefcase,
  CheckSquare,
  Square,
  RotateCcw,
  Sparkles,
  ShieldCheck,
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
    if (window.confirm('¿Deseas reiniciar la lista de tu mochila de emergencia?')) {
      setCheckedIds([]);
    }
  };

  const completedCount = checkedIds.length;
  const totalCount = EMERGENCY_KIT_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <section id="mochila" className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              Preparación Inmediata
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Mochila de Emergencia de 72 Horas
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Marca los artículos que ya tengas empacados. Esta lista se guarda automáticamente en tu navegador.
              Cada integrante de la familia debe conocer la ubicación de la mochila.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Progreso del Kit</div>
              <div className="text-lg font-black text-emerald-400">
                {completedCount} de {totalCount} ({progressPercent}%)
              </div>
            </div>
            {completedCount > 0 && (
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs p-2 rounded-lg border border-slate-700 transition"
                title="Reiniciar lista"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Items Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMERGENCY_KIT_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer rounded-xl p-3.5 border transition select-none flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-emerald-400 focus:outline-none"
                  aria-label={isChecked ? 'Desmarcar' : 'Marcar'}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-500 text-slate-950" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isChecked ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
