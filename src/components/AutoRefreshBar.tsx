import React from 'react';
import { RefreshCw, Clock, CheckCircle2, ShieldCheck, Radio } from 'lucide-react';

interface AutoRefreshBarProps {
  lastUpdated: Date;
  secondsRemaining: number;
  isRefreshing: boolean;
  onRefreshNow: () => void;
}

export const AutoRefreshBar: React.FC<AutoRefreshBarProps> = ({
  lastUpdated,
  secondsRemaining,
  isRefreshing,
  onRefreshNow,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#FFFFFF] border-b border-[#DDE1DF] text-xs text-[#687078] py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Connection & Source Status */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F8063]" />
            Conexión activa con fuentes oficiales
          </span>
          <span className="text-[#DDE1DF] hidden sm:inline">|</span>
          <span className="text-[#687078] hidden sm:inline flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#687078] stroke-[1.75]" />
            Última verificación: <span className="text-[#252A2E] font-medium font-tabular">{formatTime(lastUpdated)}</span>
          </span>
        </div>

        {/* 5-minute Auto-refresh Indicator & Manual Trigger */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[#687078] text-[11px]">
            Ciclo de 5 min: próximo en{' '}
            <span className="font-tabular font-medium text-[#245A66]">
              {formatCountdown(secondsRemaining)} min
            </span>
          </span>

          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 bg-[#F7F7F4] hover:bg-[#EAEAE4] text-[#252A2E] border border-[#DDE1DF] px-2.5 py-1 rounded-[4px] text-[11px] font-medium transition active:scale-98 disabled:opacity-50"
            title="Sincronizar fuentes y satélite ahora"
          >
            <RefreshCw
              className={`w-3 h-3 text-[#245A66] stroke-[2] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
