import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Satellite,
  BookOpen,
  Briefcase,
  Phone,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onOpenContacts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContacts }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Mapa y Trayectoria', href: '#mapa-trayectoria', icon: MapPin },
    { label: 'Refugios Temporales', href: '#refugios', icon: ShieldAlert },
    { label: 'Satélite NOAA', href: '#satelite', icon: Satellite },
    { label: 'Fuentes Oficiales', href: '#fuentes', icon: BookOpen },
    { label: 'Mochila 72h', href: '#mochila', icon: Briefcase },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-[37px] z-30 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/50">
            <span className="text-xl">🌀</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base sm:text-lg tracking-tight">
                HURACÁN SIMÓN
              </span>
              <span className="bg-red-600/30 text-red-400 border border-red-500/40 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                Pacífico
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Centro Oficial de Información de Emergencia
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContacts}
            className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-950/60 transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Directorio 911</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-200 hover:bg-slate-800/80 px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-3">
            <span>Hora Oficial México Centro (UTC-6)</span>
            <span className="font-mono text-emerald-400">EN VIVO</span>
          </div>
        </div>
      )}
    </header>
  );
};
