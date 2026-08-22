import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Smartphone,
  Battery,
  Layers,
  Box,
  Camera,
  Shield,
  Zap,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { INITIAL_PARTS } from '../data/seedData';
import { PartCategory, PartProduct } from '../types';
import { formatUGX, buildWhatsAppLink } from '../utils/format';
import { mergeWithStoredParts, sanitizeImageUrl, hydrateCatalogFromIdb } from '../utils/catalogStorage';

const DEFAULT_INCELL_SCREEN_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='350' viewBox='0 0 600 350'><rect width='600' height='350' fill='%23090d16' rx='16'/><rect x='190' y='20' width='220' height='310' rx='28' fill='%231e293b' stroke='%231D9BB5' stroke-width='4'/><rect x='206' y='40' width='188' height='270' rx='18' fill='%23020617'/><path d='M250 40 h100 v10 h-100 z' fill='%231e293b'/><rect x='220' y='75' width='160' height='200' rx='10' fill='%231D9BB5' fill-opacity='0.15' stroke='%231D9BB5' stroke-width='2' stroke-dasharray='4,4'/><text x='300' y='160' font-family='sans-serif' font-weight='900' font-size='22' fill='%231D9BB5' text-anchor='middle'>INCELL (JH)</text><text x='300' y='185' font-family='sans-serif' font-weight='700' font-size='12' fill='%2394a3b8' text-anchor='middle'>HIGH BRIGHTNESS DISPLAY</text><rect x='225' y='295' width='150' height='24' rx='6' fill='%231D9BB5'/><text x='300' y='311' font-family='sans-serif' font-weight='800' font-size='11' fill='%23ffffff' text-anchor='middle'>JH IC CHIPSET FLEX</text></svg>";

const DEFAULT_OLED_SCREEN_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='350' viewBox='0 0 600 350'><rect width='600' height='350' fill='%23030712' rx='16'/><rect x='190' y='20' width='220' height='310' rx='28' fill='%230f172a' stroke='%2306b6d4' stroke-width='4'/><rect x='206' y='40' width='188' height='270' rx='18' fill='%23000000'/><path d='M250 40 h100 v10 h-100 z' fill='%230f172a'/><circle cx='300' cy='165' r='60' fill='%2306b6d4' fill-opacity='0.18'/><text x='300' y='160' font-family='sans-serif' font-weight='900' font-size='22' fill='%2322d3ee' text-anchor='middle'>DD OLED</text><text x='300' y='185' font-family='sans-serif' font-weight='700' font-size='12' fill='%2338bdf8' text-anchor='middle'>SUPER RETINA XDR</text><rect x='215' y='295' width='170' height='24' rx='6' fill='%230284c7'/><text x='300' y='311' font-family='sans-serif' font-weight='800' font-size='11' fill='%23ffffff' text-anchor='middle'>OEM SOFT OLED FLEX</text></svg>";

function getScreenDisplayImage(part: PartProduct, tier: 'Incell' | 'OLED'): string {
  const slug = part.id.replace('part-screen-', '');
  const customIncell = sanitizeImageUrl(part.incellImageUrl || part.incell_image_url, part.id, 'incell');
  const customOled = sanitizeImageUrl(part.oledImageUrl || part.oled_image_url, part.id, 'oled');
  const mainImage = sanitizeImageUrl(part.imageUrl || part.image_url, part.id, 'main');

  if (tier === 'Incell') {
    if (customIncell) return customIncell;
    if (part.screenTier === 'Incell' && mainImage) return mainImage;
    return `/images/parts/part-screen-${slug}-incell.jpg`;
  } else {
    if (customOled) return customOled;
    if (part.screenTier === 'OLED' && mainImage) return mainImage;
    return `/images/parts/part-screen-${slug}-oled.jpg`;
  }
}

interface PartsProductsSectionProps {
  isDarkMode: boolean;
  onSelectPartForBooking: (partName: string) => void;
}

export const PartsProductsSection: React.FC<PartsProductsSectionProps> = ({
  isDarkMode,
  onSelectPartForBooking,
}) => {
  const [parts, setParts] = useState<PartProduct[]>(() => mergeWithStoredParts(INITIAL_PARTS));
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState<number>(8);
  const [selectedScreenTier, setSelectedScreenTier] = useState<Record<string, 'Incell' | 'OLED'>>({});

  const categories: { label: string; value: string; icon: React.FC<{ className?: string }> }[] = [
    { label: 'All Parts', value: 'All', icon: Package },
    { label: 'Screens', value: 'Screens', icon: Smartphone },
    { label: 'Batteries', value: 'Batteries', icon: Battery },
    { label: 'Back Glasses', value: 'Back Glasses', icon: Layers },
    { label: 'Housings', value: 'Housings', icon: Box },
    { label: 'Camera Glasses', value: 'Camera Glasses', icon: Camera },
    { label: 'Screen Guards', value: 'Screen Guards', icon: Shield },
    { label: 'Accessories', value: 'Accessories', icon: Zap },
  ];

  // Fetch Parts from Express Backend API and merge with any persistent local custom images
  const fetchParts = async () => {
    try {
      const res = await fetch('/api/parts');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const merged = mergeWithStoredParts(data);
          setParts(merged);
          return;
        }
      }
    } catch (err) {
      console.warn('Background parts sync note:', err);
    }

    // Static fallback: load from stored parts or initial seeds
    const fallback = mergeWithStoredParts(INITIAL_PARTS);
    setParts(fallback);
  };

  useEffect(() => {
    // Hydrate from IndexedDB for high-capacity offline storage
    hydrateCatalogFromIdb().then((idbParts) => {
      if (idbParts && idbParts.length > 0) {
        setParts(mergeWithStoredParts(INITIAL_PARTS));
      }
    });

    fetchParts();

    // Listen for catalog updates dispatched from Admin Inventory in real-time
    const handleCatalogUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PartProduct[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setParts(mergeWithStoredParts(customEvent.detail));
      } else {
        fetchParts();
      }
    };

    window.addEventListener('iphone_lab_catalog_updated', handleCatalogUpdate);
    window.addEventListener('storage', fetchParts);
    return () => {
      window.removeEventListener('iphone_lab_catalog_updated', handleCatalogUpdate);
      window.removeEventListener('storage', fetchParts);
    };
  }, []);

  const handleTierToggle = (partId: string, tier: 'Incell' | 'OLED') => {
    setSelectedScreenTier((prev) => ({ ...prev, [partId]: tier }));
  };

  // Category ordering helper
  const CATEGORY_ORDER: string[] = [
    'Screens',
    'Batteries',
    'Back Glasses',
    'Housings',
    'Camera Glasses',
    'Screen Guards',
    'Accessories',
  ];

  const getCategoryIndex = (category: string) => {
    const idx = CATEGORY_ORDER.indexOf(category);
    return idx !== -1 ? idx : 999;
  };

  // Screen ordering helper
  const getScreenOrderIndex = (partName: string) => {
    const order = [
      'iPhone X Screen',
      'iPhone XS Screen',
      'iPhone XS Max Screen',
      'iPhone XR Screen',
      'iPhone 11 Screen',
      'iPhone 11 Pro Screen',
      'iPhone 11 Pro Max Screen',
      'iPhone 12 & 12 Pro Screen',
      'iPhone 12 Mini Screen',
      'iPhone 12 Pro Max Screen',
      'iPhone 13 Screen',
      'iPhone 13 Mini Screen',
      'iPhone 13 Pro Screen',
      'iPhone 13 Pro Max Screen',
      'iPhone 14 Screen',
      'iPhone 14 Plus Screen',
      'iPhone 14 Pro Screen',
      'iPhone 14 Pro Max Screen',
      'iPhone 15 Screen',
      'iPhone 15 Plus Screen',
      'iPhone 15 Pro Screen',
      'iPhone 15 Pro Max Screen',
      'iPhone 16 Screen',
      'iPhone 16 Pro Screen',
      'iPhone 16 Pro Max Screen',
      'iPhone 17 Pro Screen',
      'iPhone 17 Pro Max Screen',
    ];
    const index = order.indexOf(partName);
    return index !== -1 ? index : 999;
  };

  // Battery ordering helper
  const getBatteryOrderIndex = (partName: string) => {
    const order = [
      'iPhone X Battery',
      'iPhone XS Battery',
      'iPhone XR Battery',
      'iPhone XS Max Battery',
      'iPhone 11 Battery',
      'iPhone 11 Pro Battery',
      'iPhone 11 Pro Max Battery',
      'iPhone 12 & 12 Pro Battery',
      'iPhone 12 Mini Battery',
      'iPhone 12 Pro Max Battery',
      'iPhone 13 Battery',
      'iPhone 13 Mini Battery',
      'iPhone 13 Pro Battery',
      'iPhone 13 Pro Max Battery',
      'iPhone 14 Battery',
      'iPhone 14 Pro Battery',
      'iPhone 14 Plus Battery',
      'iPhone 14 Pro Max Battery',
      'iPhone 15 Battery',
      'iPhone 15 Pro Battery',
      'iPhone 15 Plus Battery',
      'iPhone 15 Pro Max Battery',
      'iPhone 16 Battery',
      'iPhone 16 Plus Battery',
      'iPhone 16 Pro Battery',
      'iPhone 16 Pro Max Battery',
    ];
    const index = order.indexOf(partName);
    return index !== -1 ? index : 999;
  };

  const getModelScore = (part: PartProduct): number => {
    if (part.category === 'Screens') return getScreenOrderIndex(part.name);
    if (part.category === 'Batteries') return getBatteryOrderIndex(part.name);

    const text = (part.name + ' ' + part.compatibilityRange).toLowerCase();
    if (text.includes('17')) return 170;
    if (text.includes('16')) return 160;
    if (text.includes('15')) return 150;
    if (text.includes('14')) return 140;
    if (text.includes('13')) return 130;
    if (text.includes('12')) return 120;
    if (text.includes('11')) return 110;
    if (text.includes('xs') || text.includes('xr') || /\bx\b/.test(text)) return 100;
    return 999;
  };

  // Filter & Sort Parts Logic
  const filteredParts = parts
    .filter((part) => {
      const matchesCategory = activeCategory === 'All' || part.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatibilityRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (part.description && part.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const catDiff = getCategoryIndex(a.category) - getCategoryIndex(b.category);
      if (catDiff !== 0) return catDiff;

      return getModelScore(a) - getModelScore(b);
    });

  return (
    <section id="parts" className={`py-20 relative transition-colors ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-slate-100'}`}>
      {/* Background Teal Refraction Glow */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#1D9BB5]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9BB5]/10 text-[#1D9BB5] text-xs font-bold uppercase tracking-wider mb-3">
            <Package className="w-3.5 h-3.5" />
            Retail & Technician Supply Store
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-[#1F3864]'}`}>
            Tested Genuine Replacement Parts
          </h2>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore our ready-in-stock inventory for screens (Incell JH vs DD OLED), batteries, back glasses, and original Apple chargers in Kampala.
          </p>
        </div>

        {/* Search Bar & Category Pill Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <label htmlFor="parts-search-input" className="sr-only">
              Search genuine iPhone parts by model, tier or category
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <input
              id="parts-search-input"
              name="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search part by iPhone model (e.g. '13 Pro Max', 'Battery', 'Screen')..."
              className={`w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-[#1D9BB5] transition-all ${
                isDarkMode
                  ? 'glass-card-dark text-white placeholder:text-slate-400'
                  : 'glass-card-light text-slate-900 placeholder:text-slate-500 shadow-sm'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1D9BB5] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Liquid Glass Pill Categories with touch-friendly horizontal scroll on mobile */}
          <div className="flex overflow-x-auto max-w-full no-scrollbar sm:flex-wrap items-center justify-start sm:justify-center gap-2 p-2 rounded-2xl liquid-teal border border-[#1D9BB5]/30 backdrop-blur-xl">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  aria-label={`Filter by ${cat.label}`}
                  className={`relative shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1D9BB5] text-white shadow-lg shadow-[#1D9BB5]/30 scale-105'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-[#1F3864] hover:text-[#1D9BB5] hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activePillIndicator"
                      className="absolute inset-0 bg-[#1D9BB5] rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 text-[#1D9BB5] animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-400">Loading Genuine Parts Inventory...</p>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-8">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1">No parts found matching your criteria</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="glow-btn text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid with Responsive Multi-Device Support */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredParts.slice(0, searchQuery ? undefined : displayLimit).map((part) => {
                const isScreen = part.category === 'Screens';
              
              const hasIncell = isScreen && (part.screenTier === 'Incell' || part.screenTier === 'Both' || Boolean(part.incellPriceUGX));
              const hasOled = isScreen && (part.screenTier === 'OLED' || part.screenTier === 'Both' || Boolean(part.oledPriceUGX));
              const hasBothTiers = hasIncell && hasOled;

              const customIncell = part.incellImageUrl || part.incell_image_url;
              const customOled = part.oledImageUrl || part.oled_image_url;

              // Smart default: If user hasn't toggled yet, default to whichever tier has a photo
              const defaultTier: 'Incell' | 'OLED' = hasBothTiers
                ? (customIncell && !customOled ? 'Incell' : 'OLED')
                : hasIncell
                ? 'Incell'
                : 'OLED';

              const currentTier: 'Incell' | 'OLED' = isScreen
                ? (selectedScreenTier[part.id] || defaultTier)
                : 'OLED';

              const incellPrice = part.incellPriceUGX || part.priceUGX || 100000;
              const oledPrice = part.oledPriceUGX || part.priceUGX || 150000;

              const activePrice = isScreen
                ? currentTier === 'Incell'
                  ? incellPrice
                  : oledPrice
                : part.priceUGX;

              const isOutOfStock = part.stockStatus === 'Out of Stock';

              const displayImage = isScreen
                ? getScreenDisplayImage(part, currentTier)
                : sanitizeImageUrl(part.imageUrl || part.image_url, part.id, 'main');

              const whatsappText = isOutOfStock
                ? `Hello iPhone Lab UG, I am inquiring about: ${part.name} (${
                    isScreen ? currentTier + ' Tier' : ''
                  }) which is currently Out of Stock. Please notify me when restocked at Shop PB86.`
                : `Hello iPhone Lab UG, I am inquiring about: ${part.name} (${
                    isScreen ? currentTier + ' Tier' : ''
                  }) - Listed at ${formatUGX(activePrice)}. Is this in stock at Shop PB86?`;
              const whatsappUrl = buildWhatsAppLink('0753234218', whatsappText);

              return (
                <div
                  key={part.id}
                  className={`relative rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-xl hover:-translate-y-1.5 ${
                    isDarkMode
                      ? 'glass-card-dark hover:border-[#1D9BB5]/60 hover:shadow-[#1D9BB5]/10'
                      : 'glass-card-light hover:border-[#1D9BB5] hover:shadow-2xl'
                  }`}
                >
                  {/* Subtle Teal Tint & Shimmer Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1D9BB5]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Top Category Badge & Stock */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold liquid-teal text-[#1D9BB5] border border-[#1D9BB5]/20">
                        {part.category === 'Screens' && <Smartphone className="w-3.5 h-3.5" />}
                        {part.category === 'Batteries' && <Battery className="w-3.5 h-3.5" />}
                        {part.category === 'Back Glasses' && <Layers className="w-3.5 h-3.5" />}
                        {part.category === 'Housings' && <Box className="w-3.5 h-3.5" />}
                        {part.category === 'Camera Glasses' && <Camera className="w-3.5 h-3.5" />}
                        {part.category === 'Screen Guards' && <Shield className="w-3.5 h-3.5" />}
                        {part.category === 'Accessories' && <Zap className="w-3.5 h-3.5" />}
                        {part.category}
                      </span>
                      {part.stockStatus === 'Out of Stock' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : part.stockStatus === 'Limited Stock' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          Limited Stock
                        </span>
                      ) : part.stockStatus === 'Pre-Order' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          <Clock className="w-3 h-3" />
                          Pre-Order
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Product Photo with Smooth Tier Transition */}
                    {displayImage && (
                      <div className="mb-4 rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 relative bg-slate-900 group-hover:border-[#1D9BB5]/50 transition-colors z-10 flex items-center justify-center p-2">
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            key={`${part.id}-${currentTier}`}
                            src={displayImage}
                            alt={`${part.name} ${isScreen ? currentTier + ' Display' : ''}`}
                            width="300"
                            height="169"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (isScreen) {
                                target.src = currentTier === 'Incell' ? DEFAULT_INCELL_SCREEN_IMAGE : DEFAULT_OLED_SCREEN_IMAGE;
                              }
                            }}
                          />
                        </div>
                        {isScreen && (
                          <span className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-black border shadow-lg flex items-center gap-1.5 z-20 ${
                            currentTier === 'Incell'
                              ? 'text-[#1D9BB5] border-[#1D9BB5]/40'
                              : 'text-cyan-300 border-cyan-400/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              currentTier === 'Incell' ? 'bg-[#1D9BB5]' : 'bg-cyan-400'
                            }`} />
                            {currentTier === 'Incell' ? 'InCell (JH) Photo' : 'DD OLED Photo'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Part Title */}
                    <h3 className={`text-lg font-bold mb-2 transition-colors relative z-10 ${
                      isDarkMode ? 'text-white group-hover:text-[#1D9BB5]' : 'text-[#1F3864] group-hover:text-[#1D9BB5]'
                    }`}>
                      {part.name}
                    </h3>

                    {/* Compatibility Tag */}
                    <div className={`mb-4 text-xs font-semibold px-3 py-1.5 rounded-xl border relative z-10 ${
                      isDarkMode ? 'text-slate-300 bg-white/5 border-white/10' : 'text-slate-800 bg-slate-200/80 border-slate-300'
                    }`}>
                      <span className="text-[#1D9BB5] font-bold">Compatible:</span> {part.compatibilityRange}
                    </div>

                    {/* Description */}
                    {part.description && (
                      <p className={`text-xs leading-relaxed mb-4 relative z-10 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700 font-medium'
                      }`}>
                        {part.description}
                      </p>
                    )}

                    {/* Screen Tier Display / Selector */}
                    {isScreen && (
                      <div className={`mb-5 p-2.5 rounded-2xl border relative z-10 transition-colors ${
                        isDarkMode
                          ? 'bg-black/40 border-[#1D9BB5]/30'
                          : 'bg-slate-100 border-slate-200 shadow-inner'
                      }`}>
                        {hasBothTiers ? (
                          <>
                            <div className="flex items-center justify-between text-[11px] font-semibold mb-2 px-1">
                              <span className={isDarkMode ? 'text-slate-300 font-semibold' : 'text-slate-700 font-semibold'}>
                                Select Quality Tier:
                              </span>
                              <span className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                                isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                              }`}>
                                <Info className="w-3 h-3" /> Compare Specs
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleTierToggle(part.id, 'Incell')}
                                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                  currentTier === 'Incell'
                                    ? 'bg-[#1D9BB5] text-white shadow-md ring-2 ring-[#1D9BB5]/50'
                                    : isDarkMode
                                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    : 'bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-200/80 shadow-xs'
                                }`}
                              >
                                <div>InCell (JH)</div>
                                <div className="text-[11px] opacity-90">{formatUGX(incellPrice)}</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTierToggle(part.id, 'OLED')}
                                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                                  currentTier === 'OLED'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-2 ring-cyan-500/50'
                                    : isDarkMode
                                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    : 'bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-200/80 shadow-xs'
                                }`}
                              >
                                <div>DD OLED</div>
                                <div className="text-[11px] opacity-90">{formatUGX(oledPrice)}</div>
                              </button>
                            </div>
                          </>
                        ) : hasIncell ? (
                          <div className="flex items-center justify-between px-1.5 py-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9BB5] animate-pulse" />
                              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                Quality Tier: <span className="text-[#1D9BB5]">InCell (JH) Display</span>
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#1D9BB5]">{formatUGX(incellPrice)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between px-1.5 py-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                Quality Tier: <span className="text-cyan-400">DD OLED Display</span>
                              </span>
                            </div>
                            <span className="text-xs font-black text-cyan-400">{formatUGX(oledPrice)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Order CTA */}
                  <div className={`pt-4 border-t relative z-10 flex items-center justify-between gap-3 mt-2 ${
                    isDarkMode ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <div>
                      <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {isScreen ? `${currentTier} Price` : 'Uganda Price'}
                      </div>
                      <div className="text-xl font-black text-[#1D9BB5] tracking-tight">
                        {formatUGX(activePrice)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                          isOutOfStock
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                            : 'glow-btn text-white'
                        }`}
                        title={isOutOfStock ? "Request restocking alert via WhatsApp" : "Inquire or Buy Part via WhatsApp"}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Request When Back in Stock' : 'Order Part'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Parts Button for Smooth Progressive Mobile Browsing */}
          {!searchQuery && filteredParts.length > displayLimit && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 12)}
                className="px-6 py-3.5 rounded-2xl bg-[#1D9BB5] hover:bg-[#188094] text-white font-bold text-sm shadow-xl shadow-[#1D9BB5]/25 transition-all inline-flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Load More Genuine Parts ({filteredParts.length - displayLimit} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}

        {/* Bottom Supply Notice */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#1F3864] text-white max-w-4xl mx-auto shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-extrabold text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1D9BB5]" />
                Are you an iPhone Repair Technician in Kampala?
              </h4>
            </div>
            <a
              href={buildWhatsAppLink('0730700368', 'Hello iPhone Lab, I am a repair technician interested in wholesale genuine iPhone parts supply in Kampala.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4A017] hover:bg-[#b88a12] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-lg"
            >
              Contact Wholesale Desk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
