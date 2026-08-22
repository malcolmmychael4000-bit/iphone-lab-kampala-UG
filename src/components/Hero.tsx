import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Package, ShieldCheck, Zap, ChevronRight, MapPin, Award, Cpu, Camera, Check } from 'lucide-react';

interface HeroSlide {
  id: string;
  src: string;
  mobileSrc: string;
  title: string;
  subtitle: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'clean-shop',
    src: '/images/hero-clean-shop.webp',
    mobileSrc: '/images/hero-clean-shop-mobile.webp',
    title: 'Clean Diagnostic & Assembly Lab',
    subtitle: 'Anti-static benches and precision toolsets',
  },
  {
    id: 'microsoldering',
    src: '/images/hero-microsoldering.webp',
    mobileSrc: '/images/hero-microsoldering-mobile.webp',
    title: 'Micro-Soldering Workstation',
    subtitle: 'Under-microscope logic board & IC repair',
  },
  {
    id: 'backglass',
    src: '/images/hero-backglass.webp',
    mobileSrc: '/images/hero-backglass-mobile.webp',
    title: 'Laser Precision Back Glass Specialist',
    subtitle: 'Safe automated laser glue separation',
  },
];

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  isDarkMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, isDarkMode }) => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Preload next slides smoothly in background
    const preloadTimer = setTimeout(() => {
      HERO_SLIDES.slice(1).forEach((slide) => {
        const img = new Image();
        img.src = slide.src;
      });
    }, 2500);

    return () => clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#0A0E17]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="iPhone Lab Kampala Hero Section"
    >
      {/* Dynamic Background Rotating Real Photography */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {HERO_SLIDES.map((slide, idx) => (
          <picture key={slide.id}>
            <source media="(max-width: 640px)" srcSet={slide.mobileSrc} type="image/webp" />
            <source media="(min-width: 641px)" srcSet={slide.src} type="image/webp" />
            <img
              src={slide.src}
              alt={`iPhone Lab UG Workshop - ${slide.title}`}
              width={1600}
              height={900}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-all duration-1000 ease-in-out ${
                idx === currentBgIndex
                  ? 'opacity-60 md:opacity-65 scale-100'
                  : 'opacity-0 scale-105'
              }`}
              referrerPolicy="no-referrer"
            />
          </picture>
        ))}

        {/* Sophisticated Dark Ambient Overlay for 100% Contrast & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/70 to-[#0A0E17]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,14,23,0.3)_0%,rgba(10,14,23,0.85)_100%)] pointer-events-none" />

        {/* Ambient Lab Glow Highlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1D9BB5]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1F3864]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full gold-badge text-xs sm:text-sm font-bold mb-6 shadow-2xl backdrop-blur-md"
        >
          <MapPin className="w-4 h-4 text-[#1D9BB5]" />
          <span>New Pioneer Mall, Kampala · Shop PB86</span>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D4A017] ml-1">
            EXPERT LAB
          </span>
        </motion.div>

        {/* Main Title & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-5xl mx-auto mb-6 drop-shadow-md"
        >
          Specialized <span className="text-[#1D9BB5]">iPhone Repairs</span> & Original{' '}
          <span className="text-[#1D9BB5]">Parts Retail</span> in Kampala
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-2xl font-extrabold text-white mb-4 tracking-wide font-sans drop-shadow-sm"
        >
          &quot;We Fix. We Care. We Connect.&quot;
        </motion.p>

        {/* Supporting Copy - Exact Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Two things, done properly: we repair iPhones. From shattered screens to board-level micro soldering. We also sell genuine-grade iPhone parts to walk-in customers and technicians, right here at New Pioneer Mall, Shop PB86, Kampala, Uganda.
        </motion.p>

        {/* Dual Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12"
        >
          <button
            onClick={() => onNavigate('booking')}
            aria-label="Book repair service now"
            className="w-full sm:w-auto glow-btn text-white font-extrabold px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-3 group"
          >
            <Wrench className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>Book Repair Now</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('parts')}
            aria-label="Browse genuine iPhone parts catalog"
            className="w-full sm:w-auto glass-card hover:bg-white/15 text-white font-bold px-8 py-4 rounded-2xl text-base border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group backdrop-blur-md"
          >
            <Package className="w-5 h-5 text-[#1D9BB5]" />
            <span>Browse Genuine Parts</span>
          </button>
        </motion.div>

        {/* Hero Trust Bar (5-Card Row) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 max-w-6xl mx-auto text-left"
        >
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-[#1D9BB5]/50 transition-all">
            <Cpu className="w-6 h-6 text-[#1D9BB5] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Micro Precision</div>
              <div className="text-[11px] text-slate-300 leading-snug">Board-level work under the microscope</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-[#1D9BB5]/50 transition-all">
            <Zap className="w-6 h-6 text-[#1D9BB5] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Advanced Equipment</div>
              <div className="text-[11px] text-slate-300 leading-snug">Laser, hot air, ultrasonic &amp; programmers</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-[#1D9BB5]/50 transition-all">
            <Wrench className="w-6 h-6 text-[#1D9BB5] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Expert Technicians</div>
              <div className="text-[11px] text-slate-300 leading-snug">Specialists in iPhone hardware only</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-[#D4A017]/50 transition-all">
            <Award className="w-6 h-6 text-[#D4A017] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Fast Turnaround</div>
              <div className="text-[11px] text-slate-300 leading-snug">Most repairs done the same day</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-emerald-400/50 transition-all sm:col-span-2 lg:col-span-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Tested &amp; Verified</div>
              <div className="text-[11px] text-slate-300 leading-snug">100% genuine parts, tested end to end</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rotating Background Slide Info & Interactive Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-[11px] text-slate-300/80 font-medium tracking-wide hidden sm:flex items-center gap-1.5 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full border border-white/10">
          <Camera className="w-3 h-3 text-[#1D9BB5]" />
          <span>{HERO_SLIDES[currentBgIndex].title}</span>
        </div>

        <div className="flex gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentBgIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentBgIndex
                  ? 'bg-[#1D9BB5] w-8 shadow-md shadow-[#1D9BB5]/50'
                  : 'bg-white/40 hover:bg-white/80 w-2.5'
              }`}
              aria-label={`View photo: ${slide.title}`}
              aria-current={i === currentBgIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

