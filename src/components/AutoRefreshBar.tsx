import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const { language, t } = useLanguage();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', {
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
    <div className="bg-[#FFFFFF] border-b border-[#DDE1DF] text-xs sm:text-sm text-[#687078] py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Connection & Source Status */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[#3F8063] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3F8063] animate-pulse" />
            <span className="text-[#252A2E] font-bold">{t.autoSyncTitle}:</span>
            <span className="text-xs">NHC • SMN Conagua • GOES-19</span>
          </span>
          <span className="text-[#DDE1DF] hidden sm:inline">|</span>
          <span className="text-[#687078] hidden sm:inline flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#687078] stroke-[2]" />
            {t.updatedAt} <span className="text-[#252A2E] font-bold font-tabular">{formatTime(lastUpdated)}</span>
          </span>
        </div>

        {/* Rapid Auto-refresh (< 5 min) and Manual Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Interval Mode Selector */}
          {onChangeInterval && (
            <div className="hidden md:flex items-center gap-1 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-0.5">
              <span className="text-xs text-[#687078] px-1 font-semibold">{t.emergencyCycle}:</span>
              {[60, 120, 240].map((secs) => {
                const mins = secs / 60;
                const isSelected = refreshIntervalSeconds === secs;
                return (
                  <button
                    key={secs}
                    onClick={() => onChangeInterval(secs)}
                    className={`px-1.5 py-0.5 rounded-[3px] text-xs font-tabular font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#245A66] text-white font-bold shadow-xs'
                        : 'text-[#687078] hover:text-[#252A2E]'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          )}

          {/* Countdown Pill */}
          <div className="flex items-center gap-1.5 bg-[#F7F7F4] border border-[#DDE1DF] px-2 py-0.5 rounded-[3px] text-xs font-tabular">
            <span>{t.nextSyncIn}</span>
            <span className="font-bold text-[#245A66]">{formatCountdown(secondsRemaining)}</span>
          </div>

          {/* Instant Refresh Button */}
          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white px-2.5 py-1 rounded-[4px] font-bold text-xs transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
            title={t.refreshNow}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t.refreshNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
