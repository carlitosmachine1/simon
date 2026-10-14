import React, { useState, useEffect } from 'react';
import {
  Compass,
  Phone,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  BookOpen,
  Camera,
  Video,
  Share2,
  Globe,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteLogo } from './SiteLogo';

interface NavbarProps {
  onOpenContacts: () => void;
  onOpenShare: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContacts,
  onOpenShare,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    {
      id: 'perspectiva-tropical',
      label: t.navOutlook,
      href: '#perspectiva-tropical',
      icon: Layers,
    },
    {
      id: 'mapa-viento-zoom',
      label: t.navWind,
      href: '#mapa-viento-zoom',
      icon: Compass,
    },
    {
      id: 'fotos-satelitales',
      label: t.navSatellite,
      href: '#fotos-satelitales',
      icon: Camera,
    },
    {
      id: 'webcams',
      label: t.navWebcams,
      href: '#webcams',
      icon: Video,
    },
    {
      id: 'mapa-trayectoria',
      label: t.navTrajectory,
      href: '#mapa-trayectoria',
      icon: MapPin,
    },
    {
      id: 'estadisticas',
      label: t.navStats,
      href: '#estadisticas',
      icon: BarChart3,
    },
    {
      id: 'refugios',
      label: t.navShelters,
      href: '#refugios',
      icon: ShieldCheck,
    },
    {
      id: 'fuentes',
      label: t.navSources,
      href: '#fuentes',
      icon: BookOpen,
    },
  ];

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll gently when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden', 'xl:overflow-auto');
    } else {
      document.body.classList.remove('overflow-hidden', 'xl:overflow-auto');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'xl:overflow-auto');
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-[#FFFFFF] border-b border-[#DDE1DF] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Single-Element Brand Wordmark (Zero-Pill Discipline) */}
        <a
          href="/"
          className="flex items-center gap-2.5 min-w-0 shrink hover:opacity-90 transition group cursor-pointer"
          title="Monitor Pacífico"
        >
          <SiteLogo size="sm" className="shrink-0" />
          <span className="font-bold text-[#252A2E] text-base tracking-tight truncate group-hover:text-[#245A66] transition-colors">
            Monitor Pacífico
          </span>
        </a>

        {/* Zone 2: Desktop Navigation (Single-line, quiet hover, 44px rhythm) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-[4px] flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#245A66] bg-[#245A66]/10 font-bold'
                    : 'text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2]" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Tablet/Desktop controls + Mobile 911 & Hamburger) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop/Tablet Language Switcher */}
          <div className="hidden sm:flex items-center bg-[#F7F7F4] border border-[#DDE1DF] rounded-full p-0.5 text-xs font-bold font-tabular shadow-2xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                language === 'es'
                  ? 'bg-[#245A66] text-white shadow-xs font-extrabold'
                  : 'text-[#687078] hover:text-[#252A2E]'
              }`}
              title="Español (México)"
            >
              <span className="text-sm leading-none" role="img" aria-label="México">
                🇲🇽
              </span>
              <span>ES</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                language === 'en'
                  ? 'bg-[#245A66] text-white shadow-xs font-extrabold'
                  : 'text-[#687078] hover:text-[#252A2E]'
              }`}
              title="English (United States)"
            >
              <span className="text-sm leading-none" role="img" aria-label="USA">
                🇺🇸
              </span>
              <span>EN</span>
            </button>
          </div>

          {/* Desktop/Tablet Share Button */}
          <button
            onClick={onOpenShare}
            className="hidden sm:flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF] text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-[4px] shadow-2xs transition active:scale-98 cursor-pointer"
            title={t.shareBtn}
          >
            <Share2 className="w-3.5 h-3.5 text-[#245A66]" />
            <span>{t.shareBtn}</span>
          </button>

          {/* Emergency 911 Button (Visible across ALL viewports) */}
          <button
            onClick={onOpenContacts}
            className="bg-[#B84A45] hover:bg-[#a63f3a] text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition active:scale-98 cursor-pointer shrink-0 shadow-2xs"
            aria-label={t.directory911}
            title={t.directory911}
          >
            <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t.directory911}</span>
            <span className="sm:hidden font-extrabold tracking-wider">911</span>
          </button>

          {/* Mobile Menu Toggle Button (Never clips, WCAG compliant min 40px target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-[4px] text-[#252A2E] hover:bg-[#F7F7F4] border border-[#DDE1DF] cursor-pointer shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center transition"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 stroke-[2.25]" />
            ) : (
              <Menu className="w-4 h-4 stroke-[2.25]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 bg-black/40 z-30 xl:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-x-0 top-14 bg-[#FFFFFF] border-b border-[#DDE1DF] z-40 xl:hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto shadow-2xl">
            <div className="max-w-7xl mx-auto p-4 space-y-4">
              {/* Language Selector & Share Row */}
              <div className="p-3 bg-[#F7F7F4] rounded-[6px] border border-[#DDE1DF] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#687078] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#245A66]" />
                    <span>{language === 'es' ? 'Idioma del Sistema' : 'System Language'}</span>
                  </span>
                  <div className="flex items-center bg-white border border-[#DDE1DF] rounded-[4px] p-0.5 text-xs font-bold font-tabular shadow-2xs">
                    <button
                      onClick={() => setLanguage('es')}
                      className={`px-3 py-1 rounded-[3px] transition flex items-center gap-1.5 cursor-pointer ${
                        language === 'es'
                          ? 'bg-[#245A66] text-white font-extrabold shadow-2xs'
                          : 'text-[#687078] hover:text-[#252A2E]'
                      }`}
                    >
                      <span>🇲🇽</span>
                      <span>Español</span>
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-[3px] transition flex items-center gap-1.5 cursor-pointer ${
                        language === 'en'
                          ? 'bg-[#245A66] text-white font-extrabold shadow-2xs'
                          : 'text-[#687078] hover:text-[#252A2E]'
                      }`}
                    >
                      <span>🇺🇸</span>
                      <span>English</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShare();
                  }}
                  className="w-full text-xs font-bold text-[#252A2E] bg-white hover:bg-[#FAFBF9] border border-[#DDE1DF] p-2.5 rounded-[4px] flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#245A66]" />
                  <span>{t.shareBtn} — Monitor Pacífico</span>
                </button>
              </div>

              {/* Single-Column Navigation List (WCAG min 44px tap targets) */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.href)}
                      className={`w-full text-left text-sm font-medium px-3.5 py-3 rounded-[6px] flex items-center justify-between transition min-h-[44px] cursor-pointer ${
                        isActive
                          ? 'bg-[#245A66]/10 text-[#245A66] font-bold'
                          : 'text-[#252A2E] hover:bg-[#F7F7F4]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[#245A66] shrink-0 stroke-[2]" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#BAC2BF]" />
                    </button>
                  );
                })}
              </nav>

              {/* Emergency Directory Action Button */}
              <div className="pt-2 border-t border-[#DDE1DF]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContacts();
                  }}
                  className="w-full bg-[#B84A45] hover:bg-[#a63f3a] text-white font-bold text-xs py-3 px-4 rounded-[6px] flex items-center justify-center gap-2 transition shadow-xs cursor-pointer min-h-[44px]"
                >
                  <Phone className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.directory911}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
