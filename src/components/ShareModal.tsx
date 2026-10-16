import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Send,
  Satellite,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  // URL dinámica o de producción
  const shareUrl =
    typeof window !== 'undefined' && window.location.href
      ? window.location.href.split('#')[0]
      : 'https://monitor-pacifico.vercel.app';

  // Texto completo digerible para compartir
  const fullShareMessage = `${t.shareTextMsg}\n\n"${t.shareDigestibleSummary}"\n\n🔗 ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopySummary = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullShareMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullShareMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleX = () => {
    const tweetText = `${t.shareTextMsg} ${t.shareDigestibleSummary.slice(0, 110)}...`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(t.shareTextMsg + ' ' + t.shareDigestibleSummary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t.shareCardHeadline,
          text: `${t.shareTextMsg} ${t.shareDigestibleSummary}`,
          url: shareUrl,
        });
        onClose();
      } catch {
        // user cancelled or share failed
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[10px] max-w-lg w-full shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#F7F7F4] border-b border-[#DDE1DF] px-4 sm:px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#245A66]/10 text-[#245A66] flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#252A2E] leading-tight truncate">
                {t.shareTitle}
              </h3>
              <p className="text-xs text-[#687078] truncate">{t.shareSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#687078] hover:text-[#252A2E] p-1.5 rounded-[4px] hover:bg-[#EAEAE4] transition cursor-pointer shrink-0"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tarjeta de Vista Previa OpenGraph / Social Share */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#687078] flex items-center gap-1.5">
                <Satellite className="w-3.5 h-3.5 text-[#245A66]" />
                {t.sharePreviewBadge}
              </span>
              <span className="text-[11px] text-[#687078] font-tabular">
                1200 x 630 (OG Card)
              </span>
            </div>

            {/* Visual Card Mockup */}
            <div className="border border-[#DDE1DF] rounded-[8px] overflow-hidden bg-[#F7F7F4] shadow-xs group">
              <div className="relative aspect-[16/9] w-full bg-[#1A1E21] overflow-hidden">
                <img
                  src="/og-satellite.png"
                  alt="Satélite NOAA Perspectiva Tropical"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                {/* Overlay Badge */}
                <div className="absolute top-2 left-2 bg-[#1A1E21]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-[3px] border border-white/10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3F8063] animate-pulse" />
                  NOAA GOES-19 • OFICIAL
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white/90 text-[10px] font-mono px-2 py-0.5 rounded-[3px]">
                  Pacífico Mexicano
                </div>
              </div>

              <div className="p-3 bg-white border-t border-[#DDE1DF]">
                <div className="text-[10px] uppercase font-bold text-[#245A66] tracking-wider mb-0.5">
                  monitor-pacifico.vercel.app • TIEMPO REAL
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#252A2E] leading-snug">
                  {t.shareCardHeadline}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#525B62] mt-1 leading-relaxed">
                  {t.shareDigestibleSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Botón rápido para copiar resumen + enlace */}
          <button
            onClick={handleCopySummary}
            className={`w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-[6px] border transition cursor-pointer shadow-xs active:scale-98 ${
              copiedSummary
                ? 'bg-[#3F8063] text-white border-[#3F8063]'
                : 'bg-[#F0F5F4] hover:bg-[#E3ECEB] text-[#245A66] border-[#BCD4D0]'
            }`}
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.shareSummaryCopiedSuccess}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-[#245A66]" />
                <span>{t.shareCopySummaryBtn}</span>
              </>
            )}
          </button>

          {/* Enlace Directo */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#687078]">
              {t.shareCopyUrl}
            </label>
            <div className="flex items-center gap-2 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[6px] p-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent flex-1 text-xs text-[#252A2E] px-2 outline-none truncate font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-[4px] transition cursor-pointer shrink-0 ${
                  copiedLink
                    ? 'bg-[#3F8063] text-white shadow-xs'
                    : 'bg-[#245A66] hover:bg-[#1D4852] text-white shadow-xs'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t.shareCopiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2]" />
                    <span>{t.shareCopyUrl}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Redes Sociales y Mensajería */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#687078] block">
              {language === 'en' ? 'Social Channels & Chat' : 'Canales de Redes y Mensajería'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs py-2 px-2.5 rounded-[6px] transition cursor-pointer active:scale-98"
                title="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                onClick={handleTelegram}
                className="flex items-center justify-center gap-1.5 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-[#0088cc] font-bold text-xs py-2 px-2.5 rounded-[6px] transition cursor-pointer active:scale-98"
                title="Telegram"
              >
                <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                <span>Telegram</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={handleX}
                className="flex items-center justify-center gap-1.5 bg-[#000000]/5 hover:bg-[#000000]/10 border border-[#000000]/30 text-[#000000] font-bold text-xs py-2 px-2.5 rounded-[6px] transition cursor-pointer active:scale-98"
                title="X / Twitter"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X / Post</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="flex items-center justify-center gap-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] font-bold text-xs py-2 px-2.5 rounded-[6px] transition cursor-pointer active:scale-98"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Compartir nativo en móviles si está soportado */}
          {hasNativeShare && (
            <div className="pt-2 border-t border-[#DDE1DF]">
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 bg-[#F7F7F4] hover:bg-[#EAECE8] border border-[#DDE1DF] text-[#252A2E] font-semibold text-xs sm:text-sm py-2 px-3 rounded-[6px] transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#245A66]" />
                <span>{t.shareNative}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F7F7F4] border-t border-[#DDE1DF] px-4 sm:px-5 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-[#687078]">
            {language === 'en' ? 'OpenGraph image: /og-satellite.png' : 'Imagen OpenGraph: /og-satellite.png'}
          </span>
          <button
            onClick={onClose}
            className="text-xs sm:text-sm font-semibold text-[#687078] hover:text-[#252A2E] px-3 py-1 rounded cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
