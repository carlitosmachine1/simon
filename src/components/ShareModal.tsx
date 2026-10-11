import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const PRODUCTION_SHARE_URL = 'https://monitor-pacifico.vercel.app';
  const shareText = `${t.shareTextMsg} ${PRODUCTION_SHARE_URL}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(PRODUCTION_SHARE_URL);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = PRODUCTION_SHARE_URL;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleX = () => {
    const text = t.shareTextMsg;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(PRODUCTION_SHARE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PRODUCTION_SHARE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t.brandTitle,
          text: t.shareTextMsg,
          url: PRODUCTION_SHARE_URL,
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#DDE1DF] rounded-[8px] max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#F7F7F4] border-b border-[#DDE1DF] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#245A66]/10 text-[#245A66] flex items-center justify-center">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#252A2E] leading-tight">
                {t.shareTitle}
              </h3>
              <p className="text-xs text-[#687078]">{t.shareSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#687078] hover:text-[#252A2E] p-1.5 rounded-[4px] hover:bg-[#EAEAE4] transition cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* 1. Copiar Enlace Directo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#687078]">
              {t.shareCopyUrl}
            </label>
            <div className="flex items-center gap-2 bg-[#F7F7F4] border border-[#DDE1DF] rounded-[6px] p-1.5">
              <input
                type="text"
                readOnly
                value={PRODUCTION_SHARE_URL}
                className="bg-transparent flex-1 text-xs text-[#252A2E] px-2 outline-none truncate font-tabular"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-[4px] transition cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-[#3F8063] text-white shadow-xs'
                    : 'bg-[#245A66] hover:bg-[#1D4852] text-white shadow-xs'
                }`}
              >
                {copied ? (
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

          {/* 2. Redes Sociales */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687078] block">
              Redes Sociales / Social Networks
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs py-2.5 px-3 rounded-[6px] transition cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={handleX}
                className="flex items-center justify-center gap-2 bg-[#000000]/5 hover:bg-[#000000]/10 border border-[#000000]/30 text-[#000000] font-bold text-xs py-2.5 px-3 rounded-[6px] transition cursor-pointer active:scale-98"
              >
                {/* X Icon SVG */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X (Twitter)</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] font-bold text-xs py-2.5 px-3 rounded-[6px] transition cursor-pointer active:scale-98"
              >
                {/* Facebook Icon SVG */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* 3. Compartir con App nativa en móviles si está soportado */}
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
        <div className="bg-[#F7F7F4] border-t border-[#DDE1DF] px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs sm:text-sm font-semibold text-[#687078] hover:text-[#252A2E] px-4 py-1.5 rounded cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
