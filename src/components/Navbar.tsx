import React from 'react';
import {
  Compass,
  Phone,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  Satellite,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Camera,
  Video,
} from 'lucide-react';

interface NavbarProps {
  onOpenContacts: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContacts,
  activeSection,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'mapa-viento-zoom', label: 'Viento en Vivo', href: '#mapa-viento-zoom', icon: Compass },
    { id: 'fotos-satelitales', label: 'Fotos Satelitales', href: '#fotos-satelitales', icon: Camera },
    { id: 'webcams', label: 'Webcams en Vivo', href: '#webcams', icon: Video },
    { id: 'mapa-trayectoria', label: 'Trayectoria', href: '#mapa-trayectoria', icon: MapPin },
    { id: 'refugios', label: 'Refugios', href: '#refugios', icon: ShieldCheck },
    { id: 'fuentes', label: 'Fuentes Oficiales', href: '#fuentes', icon: BookOpen },
  ];

  return (
    <header className="bg-[#FFFFFF] border-b border-[#DDE1DF] sticky top-0 z-40 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#245A66] text-white flex items-center justify-center font-bold text-sm tracking-wider">
            S4
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#252A2E] text-sm tracking-tight">
                HURACÁN SIMÓN
              </span>
              <span className="text-[11px] font-medium text-[#245A66] bg-[#245A66]/10 px-1.5 py-0.5 rounded-[3px]">
                Pacífico
              </span>
            </div>
            <div className="text-[11px] text-[#687078] truncate leading-tight">
              Centro No oficial pero si fuentes oficiales
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
                className={`text-xs font-medium px-2.5 py-1.5 rounded-[4px] flex items-center gap-1.5 transition ${
                  isActive
                    ? 'text-[#245A66] bg-[#245A66]/8 font-semibold'
                    : 'text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Emergency Action & Mobile Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContacts}
            className="bg-[#B84A45] hover:bg-[#a63f3a] text-white font-medium text-xs px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 stroke-[2]" />
            <span>Directorio 911</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-[4px] text-[#687078] hover:text-[#252A2E] hover:bg-[#F7F7F4] border border-[#DDE1DF]"
            aria-label="Menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#DDE1DF] px-4 py-2 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-[#252A2E] hover:bg-[#F7F7F4] px-3 py-2 rounded-[4px] flex items-center gap-2 transition"
              >
                <Icon className="w-4 h-4 text-[#245A66]" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
