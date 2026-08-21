import React from 'react';
import { Logo } from './Logo';
import { Phone, MapPin, Clock, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`border-t transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-slate-800 text-slate-300' : 'bg-[#1F3864] border-[#1F3864] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Logo isDarkMode={true} className="h-10" />
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Kampala’s specialized iPhone repair laboratory & genuine parts supplier. Micro-soldering, laser back glass, screen swaps, and high capacity batteries.
            </p>
            <div className="text-xs font-bold text-[#D4A017] tracking-wider uppercase">
              &quot;We Fix. We Care. We Connect.&quot;
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#1D9BB5]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#1D9BB5] transition-colors">
                  What We Fix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('parts')} className="hover:text-[#1D9BB5] transition-colors">
                  Genuine Parts Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trust')} className="hover:text-[#1D9BB5] transition-colors">
                  Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-[#1D9BB5] transition-colors">
                  Book Repair Slot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#1D9BB5] transition-colors">
                  Find Our Kampala Shop
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#1D9BB5]">
              Shop PB86 Details
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#1D9BB5] shrink-0 mt-0.5" />
                <span>New Pioneer Mall, Kampala, Shop PB86</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1D9BB5] shrink-0" />
                <a href="tel:0753234218" className="hover:underline">0753 234 218</a> / <a href="tel:0730700368" className="hover:underline">0730 700 368</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1D9BB5] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM | Sunday: APPOINTMENTS ONLY</span>
              </div>
            </div>
          </div>

          {/* Col 4: Social & Community */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#1D9BB5]">
              Social & Community
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://www.tiktok.com/search?q=iphone%20lab%20uganda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black hover:bg-black/80 border border-white/20 hover:border-[#1D9BB5] text-white font-bold transition-all shadow-md group"
              >
                <span className="w-2 h-2 rounded-full bg-[#1D9BB5] animate-pulse"></span>
                <span>TikTok: iPhone Lab Uganda</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with subtle Staff Login / Admin Link */}
        <div className="pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} iPhone Lab UG. All Rights Reserved. Specialized iPhone Repair Laboratory, Kampala.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('admin');
              }}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#1D9BB5] transition-colors font-medium text-[11px] hover:underline"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Staff Login</span>
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white/10 hover:bg-[#1D9BB5] text-white transition-all shrink-0"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
