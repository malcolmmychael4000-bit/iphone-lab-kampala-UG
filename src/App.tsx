import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { PartsProductsSection } from './components/PartsProductsSection';
import { TrustSection } from './components/TrustSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingForm } from './components/BookingForm';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

// Admin panel is code-split so regular visitors don't load admin code
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));

export type ThemeMode = 'light' | 'dark' | 'system';

// Skeleton fallback loader only for Admin panel navigation
const AdminSkeleton: React.FC = () => (
  <div className="min-h-screen py-24 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center opacity-30 animate-pulse">
    <div className="h-10 w-72 bg-slate-700 rounded-xl mb-6" />
    <div className="h-6 w-96 bg-slate-800 rounded-lg mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <div className="h-64 bg-slate-800/60 rounded-3xl" />
      <div className="h-64 bg-slate-800/60 rounded-3xl" />
      <div className="h-64 bg-slate-800/60 rounded-3xl" />
    </div>
  </div>
);

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('iphone_lab_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'dark'; // default
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('iphone_lab_theme') as ThemeMode;
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [preselectedService, setPreselectedService] = useState<string>('');

  useEffect(() => {
    const checkRoute = () => {
      if (window.location.pathname.endsWith('/admin') || window.location.hash === '#admin') {
        setActiveSection('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const isDark = themeMode === 'system' ? mediaQuery.matches : themeMode === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    localStorage.setItem('iphone_lab_theme', themeMode);

    const handleSystemThemeChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode]);

  const handleSetTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleToggleTheme = () => {
    if (themeMode === 'dark') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('system');
    } else {
      setThemeMode('dark');
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'admin') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    handleNavigate('booking');
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#1D9BB5] selection:text-white transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Accessible Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#1D9BB5] focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-extrabold focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Top Fixed Navbar */}
      <Navbar
        isDarkMode={isDarkMode}
        themeMode={themeMode}
        onSetTheme={handleSetTheme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Single Page Content or Admin Console View */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {activeSection === 'admin' ? (
          <Suspense fallback={<AdminSkeleton />}>
            <AdminPanel
              isDarkMode={isDarkMode}
              onBackToMain={() => handleNavigate('hero')}
            />
          </Suspense>
        ) : (
          <>
            <Hero onNavigate={handleNavigate} isDarkMode={isDarkMode} />
            <ServicesGrid
              isDarkMode={isDarkMode}
              onSelectServiceForBooking={handleSelectServiceForBooking}
            />
            <PartsProductsSection
              isDarkMode={isDarkMode}
              onSelectPartForBooking={(partName) => handleSelectServiceForBooking(partName)}
            />
            <TrustSection isDarkMode={isDarkMode} />
            <ReviewsSection isDarkMode={isDarkMode} />
            <BookingForm
              isDarkMode={isDarkMode}
              preselectedService={preselectedService}
            />
            <ContactSection isDarkMode={isDarkMode} />
          </>
        )}
      </main>

      {/* Floating WhatsApp Action Button & Footer */}
      <FloatingWhatsApp />
      <Footer isDarkMode={isDarkMode} onNavigate={handleNavigate} />
    </div>
  );
}
