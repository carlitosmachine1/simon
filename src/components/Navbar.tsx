import React from 'react';
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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { id: 'mapa-viento-zoom', label: t.navWind, href: '#mapa-viento-zoom', icon: Compass },
    { id: 'fotos-satelitales', label: t.navSatellite, href: '#fotos-satelitales', icon: Camera },
    { id: 'webcams', label: t.navWebcams, href: '#webcams', icon: Video },
    { id: 'mapa-trayectoria', label: t.navTrajectory, href: '#mapa-trayectoria', icon: MapPin },
    { id: 'refugios', label: t.navShelters, href: '#refugios', icon: ShieldCheck },
    { id: 'fuentes', label: t.navSources, href: '#fuentes', icon: BookOpen },
  ];

  return (
    <header className="bg-[#FFFFFF] border-b border-[#DDE1DF] sticky top-0 z-40 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#245A66] text-white flex items-center justify-center font-bold text-sm tracking-wider shrink-0">
            S4
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#252A2E] text-sm tracking-tight truncate">
                {t.brandTitle}
              </span>
              <span className="text-[11px] font-bold text-[#245A66] bg-[#245A66]/10 px-1.5 py-0.5 rounded-[3px] shrink-0 font-tabular">
                {t.basin}
              </span>
            </div>
            <div className="text-xs text-[#687078] truncate leading-tight hidden xs:block">
              {t.brandSubtitle}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-[4px] flex items-center gap-1.5 transition ${
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

        {/* Top Right Controls: Switch Idioma con banderas + Botón Compartir + Directorio 911 */}
        <div className="flex items-center gap-2">
          {/* Switch de Idioma con Banderas MX / USA */}
          <div className="flex items-center bg-[#F7F7F4] border border-[#DDE1DF] rounded-full p-0.5 text-xs font-bold font-tabular shadow-2xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                language === 'es'
                  ? 'bg-[#245A66] text-white shadow-xs font-extrabold'
                  : 'text-[#687078] hover:text-[#252A2E]'
              }`}
              title="Español (México)"
            >
              <span className="text-sm leading-none" role="img" aria-label="México">🇲🇽</span>
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
              <span className="text-sm leading-none" role="img" aria-label="USA">🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          {/* Botón Compartir en Redes */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F7F7F4] text-[#252A2E] border border-[#DDE1DF] text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-[4px] shadow-xs transition active:scale-98 cursor-pointer"
            title={t.shareBtn}
          >
            <Share2 className="w-3.5 h-3.5 text-[#245A66]" />
            <span className="hidden sm:inline">{t.shareBtn}</span>
          </button>

          {/* Botón Directorio 911 */}
          <button
            onClick={onOpenContacts}
            className="bg-[#B84A45] hover:bg-[#a63f3a] text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition active:scale-98 cursor-pointer shrink-0"
          >
            <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t.directory911}</span>
            <span className="sm:hidden">911</span>
          </button>

          {/* Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-[4px] text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4] border border-[#DDE1DF] cursor-pointer"
            aria-label="Menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#DDE1DF] px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-[#DDE1DF]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#252A2E] hover:bg-[#F7F7F4] p-2 rounded-[4px] flex items-center gap-2 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-[#245A66] shrink-0" />
                  <span className="truncate">{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#687078] font-bold">Idioma / Language:</span>
            <div className="flex items-center bg-[#F7F7F4] border border-[#DDE1DF] rounded-full p-0.5 text-xs font-bold font-tabular shadow-2xs">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                  language === 'es' ? 'bg-[#245A66] text-white shadow-xs font-extrabold' : 'text-[#687078]'
                }`}
              >
                <span className="text-sm leading-none" role="img" aria-label="México">🇲🇽</span>
                <span>Español</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                  language === 'en' ? 'bg-[#245A66] text-white shadow-xs font-extrabold' : 'text-[#687078]'
                }`}
              >
                <span className="text-sm leading-none" role="img" aria-label="USA">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
