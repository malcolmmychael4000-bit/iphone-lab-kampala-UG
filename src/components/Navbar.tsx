import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Sun, Moon, Monitor, Menu, X, Phone, ShieldCheck, Wrench, Package, MapPin, Calendar, Clock } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/format';
import { ThemeMode } from '../App';

interface NavbarProps {
  isDarkMode: boolean;
  themeMode?: ThemeMode;
  onSetTheme?: (mode: ThemeMode) => void;
  onToggleTheme: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  themeMode = 'dark',
  onSetTheme,
  onToggleTheme,
  activeSection,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'services', label: 'What We Fix', icon: Wrench },
    { id: 'parts', label: 'Genuine Parts', icon: Package },
    { id: 'trust', label: 'Why Us', icon: ShieldCheck },
    { id: 'booking', label: 'Book Repair', icon: Calendar },
    { id: 'contact', label: 'Find Us', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = buildWhatsAppLink('0753234218', 'Hello iPhone Lab UG, I would like to inquire about an iPhone repair or genuine part.');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-md'
          : isDarkMode
          ? 'bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-transparent backdrop-blur-sm'
          : 'bg-gradient-to-b from-white/95 to-transparent'
      }`}
    >
      {/* Top Notification Bar */}
      <div className="bg-[#1F3864]/95 backdrop-blur-md text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto border-b border-white/10">
        <div className="hidden sm:flex items-center gap-3">
          <span>📍 New Pioneer Mall, Kampala, Shop PB86</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1 text-[#38BDF8] font-bold">
            <Clock className="w-3 h-3 text-[#38BDF8]" />
            Mon–Sat: 8:00 AM – 7:00 PM | Sun: Appointments Only
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <a
            href="tel:0753234218"
            className="hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-bold text-slate-100"
            aria-label="Call shop phone numbers"
          >
            <Phone className="w-3 h-3 text-[#38BDF8]" />
            0753 234 218 / 0730 700 368
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BB5] rounded-xl p-1 -ml-1 group"
            aria-label="iPhone Lab UG Home"
          >
            <Logo isDarkMode={isDarkMode} className="h-10 sm:h-12 my-auto" />
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className={`hidden lg:flex items-center gap-1 xl:gap-2 p-1.5 rounded-2xl border backdrop-blur-md ${
              isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-slate-100/80 border-slate-200'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-[#1D9BB5] shadow-lg shadow-[#1D9BB5]/30'
                      : isDarkMode
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[#1F3864] hover:text-[#1D9BB5] hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#1D9BB5]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Segmented Theme Switcher (Light / Dark / System) & WhatsApp CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Smooth Theme Switcher Segmented Control */}
            {onSetTheme ? (
              <div
                role="radiogroup"
                aria-label="Theme Selection"
                className={`flex items-center p-1 rounded-2xl border backdrop-blur-md ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-200/80 border-slate-300'
                }`}
              >
                <button
                  onClick={() => onSetTheme('light')}
                  role="radio"
                  aria-checked={themeMode === 'light'}
                  className={`p-2 min-w-[36px] min-h-[36px] rounded-xl transition-all flex items-center justify-center text-xs font-semibold ${
                    themeMode === 'light'
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Light Mode"
                  aria-label="Switch to Light Mode"
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                </button>

                <button
                  onClick={() => onSetTheme('dark')}
                  role="radio"
                  aria-checked={themeMode === 'dark'}
                  className={`p-2 min-w-[36px] min-h-[36px] rounded-xl transition-all flex items-center justify-center text-xs font-semibold ${
                    themeMode === 'dark'
                      ? 'bg-slate-800 text-white shadow-md font-bold'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Dark Mode"
                  aria-label="Switch to Dark Mode"
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                </button>

                <button
                  onClick={() => onSetTheme('system')}
                  role="radio"
                  aria-checked={themeMode === 'system'}
                  className={`p-2 min-w-[36px] min-h-[36px] rounded-xl transition-all flex items-center justify-center text-xs font-semibold ${
                    themeMode === 'system'
                      ? 'bg-[#1D9BB5] text-white shadow-md font-bold'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="System Theme"
                  aria-label="Switch to System Theme"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleTheme}
                className={`p-2.5 rounded-full transition-all border min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 hover:border-yellow-400/50'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle Theme"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Direct WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact iPhone Lab via WhatsApp (opens in new tab)"
              className="glow-btn text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 min-h-[44px]"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile & Tablet Toggle Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {onSetTheme ? (
              <div
                role="radiogroup"
                aria-label="Theme Selection"
                className={`flex items-center p-1 rounded-xl border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
                }`}
              >
                <button
                  onClick={() => onSetTheme('light')}
                  role="radio"
                  aria-checked={themeMode === 'light'}
                  className={`p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg ${themeMode === 'light' ? 'bg-white text-slate-900' : 'text-slate-400'}`}
                  aria-label="Light mode"
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                </button>
                <button
                  onClick={() => onSetTheme('dark')}
                  role="radio"
                  aria-checked={themeMode === 'dark'}
                  className={`p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg ${themeMode === 'dark' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                  aria-label="Dark mode"
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                </button>
                <button
                  onClick={() => onSetTheme('system')}
                  role="radio"
                  aria-checked={themeMode === 'system'}
                  className={`p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg ${themeMode === 'system' ? 'bg-[#1D9BB5] text-white' : 'text-slate-400'}`}
                  aria-label="System mode"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleTheme}
                className={`p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg ${
                  isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-800'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border ${
                isDarkMode ? 'border-slate-700 text-white bg-slate-800/80' : 'border-slate-300 text-slate-800 bg-white'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile Navigation"
          className={`lg:hidden border-b px-4 py-6 space-y-3 transition-colors shadow-2xl ${
            isDarkMode ? 'bg-[#0A0E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full px-4 py-3.5 min-h-[48px] rounded-xl text-base font-bold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#1D9BB5] text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-white/5 hover:bg-white/10 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#1D9BB5]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp with iPhone Lab (opens in new tab)"
              className="w-full glow-btn text-white font-extrabold py-3.5 px-4 min-h-[48px] rounded-xl text-base flex items-center justify-center gap-2"
            >
              <span>WhatsApp Technical Desk</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
