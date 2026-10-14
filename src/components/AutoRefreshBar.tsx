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
  const isEn = language === 'en';

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
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Connection & Source Status (Responsive truncation on mobile) */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#3F8063] shrink-0" />
          <div className="min-w-0 truncate text-xs">
            <span className="text-[#252A2E] font-bold">
              {isEn ? 'Official Live Feed' : 'Fuentes Oficiales'}:
            </span>{' '}
            <span className="text-[#687078] hidden sm:inline">NHC • SMN Conagua • GOES-19</span>
            <span className="text-[#687078] sm:hidden">NHC / Conagua</span>
          </div>
          <span className="text-[#DDE1DF] hidden md:inline">|</span>
          <span className="text-[#687078] hidden md:flex items-center gap-1 shrink-0 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#687078] stroke-[2]" />
            <span>{t.updatedAt}</span>
            <span className="text-[#252A2E] font-bold font-tabular">{formatTime(lastUpdated)}</span>
          </span>
        </div>

        {/* Rapid Auto-refresh (< 5 min) and Manual Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Interval Mode Selector (Desktop only) */}
          {onChangeInterval && (
            <div className="hidden lg:flex items-center gap-1 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[4px] p-0.5">
              <span className="text-[11px] text-[#687078] px-1 font-semibold">
                {t.emergencyCycle}:
              </span>
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
          <div className="flex items-center gap-1 bg-[#F7F7F4] border border-[#DDE1DF] px-2 py-1 rounded-[3px] text-xs font-tabular shrink-0">
            <span className="hidden xs:inline">{t.nextSyncIn}</span>
            <span className="font-bold text-[#245A66]">{formatCountdown(secondsRemaining)}</span>
          </div>

          {/* Instant Refresh Button */}
          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#245A66] hover:bg-[#1D4852] text-white px-2.5 py-1 rounded-[4px] font-bold text-xs transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
            title={t.refreshNow}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">{t.refreshNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
