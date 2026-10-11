import React from 'react';
import { RefreshCw, Clock, CheckCircle2, Radio, Zap } from 'lucide-react';

interface AutoRefreshBarProps {
  lastUpdated: Date;
  secondsRemaining: number;
  isRefreshing: boolean;
  onRefreshNow: () => void;
  refreshIntervalSeconds?: number;
  onChangeInterval?: (seconds: number) => void;
}

export const AutoRefreshBar: React.FC<AutoRefreshBarProps> = ({
  lastUpdated,
  secondsRemaining,
  isRefreshing,
  onRefreshNow,
  refreshIntervalSeconds = 120,
  onChangeInterval,
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

  const intervalMinutes = Math.round(refreshIntervalSeconds / 60);

  return (
    <div className="bg-[#FFFFFF] border-b border-[#DDE1DF] text-xs text-[#687078] py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Connection & Source Status */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3F8063] animate-pulse" />
            <span className="text-[#252A2E] font-semibold">Fuentes oficiales en vivo:</span>
            <span>NHC • SMN Conagua • GOES-19</span>
          </span>
          <span className="text-[#DDE1DF] hidden sm:inline">|</span>
          <span className="text-[#687078] hidden sm:inline flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#687078] stroke-[1.75]" />
            Última verificación: <span className="text-[#252A2E] font-medium font-tabular">{formatTime(lastUpdated)}</span>
          </span>
        </div>

        {/* Rapid Auto-refresh (< 5 min) and Manual Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Interval Mode Selector */}
          {onChangeInterval && (
            <div className="hidden md:flex items-center gap-1 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-0.5">
              <span className="text-[10px] text-[#687078] px-1 font-medium">Ciclo:</span>
              <button
                onClick={() => onChangeInterval(60)}
                className={`text-[10px] px-1.5 py-0.5 rounded-[2px] font-medium transition ${
                  refreshIntervalSeconds === 60
                    ? 'bg-[#245A66] text-white'
                    : 'text-[#687078] hover:text-[#252A2E]'
                }`}
                title="Actualizar cada 1 minuto"
              >
                1 min
              </button>
              <button
                onClick={() => onChangeInterval(120)}
                className={`text-[10px] px-1.5 py-0.5 rounded-[2px] font-medium transition ${
                  refreshIntervalSeconds === 120
                    ? 'bg-[#245A66] text-white'
                    : 'text-[#687078] hover:text-[#252A2E]'
                }`}
                title="Actualizar cada 2 minutos (Recomendado para emergencias)"
              >
                2 min ⚡
              </button>
              <button
                onClick={() => onChangeInterval(300)}
                className={`text-[10px] px-1.5 py-0.5 rounded-[2px] font-medium transition ${
                  refreshIntervalSeconds === 300
                    ? 'bg-[#245A66] text-white'
                    : 'text-[#687078] hover:text-[#252A2E]'
                }`}
                title="Actualizar cada 5 minutos"
              >
                5 min
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] bg-[#F7F7F4] border border-[#DDE1DF] px-2 py-1 rounded-[4px]">
            <Zap className="w-3 h-3 text-[#D99A38]" />
            <span className="text-[#687078]">
              Refresco cada {intervalMinutes} min: próximo en{' '}
              <strong className="font-tabular font-semibold text-[#245A66]">
                {formatCountdown(secondsRemaining)}
              </strong>
            </span>
          </div>

          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1b434c] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-semibold transition active:scale-98 disabled:opacity-50 cursor-pointer shadow-xs"
            title="Sincronizar mapa de trayectoria, cálculos y fotos satelitales ahora"
          >
            <RefreshCw
              className={`w-3 h-3 stroke-[2] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Actualizando...' : 'Actualizar ahora'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
