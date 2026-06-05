import { useState, useEffect, useRef } from 'react';
import { CartProvider, useCart } from './cartContext';
import { MENU_ITEMS } from './data';
import { MenuItem } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { MenuItemCard } from './components/MenuItemCard';
import { CustomizerModal } from './components/CustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutFlow } from './components/CheckoutFlow';
import { OrderTracker } from './components/OrderTracker';
import { Sparkles, Pizza, Flame, Store, Truck, Navigation, ChevronUp, Gift, User, Award, Percent, ClipboardCheck, Sparkle, LogOut, CheckCircle } from 'lucide-react';
import { PizzaMasterLogo } from './components/PizzaMasterLogo';
import { SidebarNav } from './components/SidebarNav';

function PizzaMasterMain() {
  const { cart, activeOrder, applyPromoCode, promoCode } = useCart();
  const [activeCategory, setActiveCategory] = useState('deals');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Loading Screen Animation State
  const [appLoading, setAppLoading] = useState(true);

  // High-fidelity sidebar modal states
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [successApplyMsg, setSuccessApplyMsg] = useState<string | null>(null);

  // Simulated 1.8s load-out sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const sectionRefs = {
    deals: useRef<HTMLDivElement>(null),
    pizzas: useRef<HTMLDivElement>(null),
    starters: useRef<HTMLDivElement>(null),
    pasta: useRef<HTMLDivElement>(null),
    desserts: useRef<HTMLDivElement>(null),
    beverages: useRef<HTMLDivElement>(null),
    dips: useRef<HTMLDivElement>(null),
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll spy mechanism to automatically update category bar underline
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Scroll Spy Category Detector
      const categories: (keyof typeof sectionRefs)[] = [
        'deals',
        'pizzas',
        'starters',
        'pasta',
        'desserts',
        'beverages',
        'dips',
      ];

      const headerHeight = 160; // Approximate offset for sticky headers
      for (const cat of categories) {
        const ref = sectionRefs[cat].current;
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // If top of category meets scroll thresholds
          if (rect.top <= headerHeight + 50 && rect.bottom >= headerHeight) {
            setActiveCategory(cat);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    const ref = sectionRefs[cat as keyof typeof sectionRefs].current;
    if (ref) {
      const headerElement = document.getElementById('app-header');
      const offset = (headerElement ? headerElement.offsetHeight : 80) + 60; // Include sticky header and category offsets
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = ref.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleDealCtaClick = (dealId: string) => {
    const matchedDeal = MENU_ITEMS.find((item) => item.id === dealId);
    if (matchedDeal) {
      setCustomizingItem(matchedDeal);
    }
  };

  const handleOrderSubmitted = () => {
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
  };

  const handleApplyCouponFromModal = (code: string) => {
    const res = applyPromoCode(code);
    if (res.success) {
      setSuccessApplyMsg(res.message);
      setCopiedCoupon(code);
      setTimeout(() => {
        setSuccessApplyMsg(null);
        setCopiedCoupon(null);
        setIsPromoModalOpen(false);
      }, 1500);
    }
  };

  // Group foods into categories
  const groupedMenu = {
    deals: MENU_ITEMS.filter((item) => item.category === 'deals'),
    pizzas: MENU_ITEMS.filter((item) => item.category === 'pizzas'),
    starters: MENU_ITEMS.filter((item) => item.category === 'starters'),
    pasta: MENU_ITEMS.filter((item) => item.category === 'pasta'),
    desserts: MENU_ITEMS.filter((item) => item.category === 'desserts'),
    beverages: MENU_ITEMS.filter((item) => item.category === 'beverages'),
    dips: MENU_ITEMS.filter((item) => item.category === 'dips'),
  };

  return (
    <div className={`min-h-screen ${isAmbientActive ? 'theme-dark' : 'theme-light'} bg-[#07080b] text-neutral-100 flex font-sans antialiased text-sm transition-all duration-500 overflow-x-hidden ${isAmbientActive ? 'shadow-[inset_24px_0_80px_rgba(234,179,8,0.02)]' : ''}`}>
      
      {/* 0. Left Nav Rail Sidebar (only visible on desktop md and up) */}
      <SidebarNav
        activeCategory={activeCategory}
        onCategorySelect={handleCategoryNav}
        onTrackerToggle={() => setIsTrackerOpen(true)}
        onPromoClick={() => setIsPromoModalOpen(true)}
        onLocationClick={() => {
          // Scroll dynamically to active supporting branch address details
          const footerLogo = document.getElementById('scroll-to-top-btn');
          if (footerLogo) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          } else {
            const bottomLoc = document.getElementById('category-dips');
            if (bottomLoc) bottomLoc.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onUserClick={() => setIsUserModalOpen(true)}
        onAmbientToggle={() => setIsAmbientActive(!isAmbientActive)}
        isAmbientActive={isAmbientActive}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      {/* Main Canvas body shifted right to compensate for left sidebar space on desktop */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:pl-64' : 'md:pl-20'}`}>
        
        {/* 1. Primary Header */}
        <Header
          onCartToggle={() => setIsCartOpen(!isCartOpen)}
          onTrackerToggle={() => setIsTrackerOpen(true)}
          onCategorySelect={handleCategoryNav}
        />

        {/* 2. Interactive Promos Hero Slider */}
        <HeroBanner
          onExploreClick={() => handleCategoryNav('pizzas')}
          onDealClick={handleDealCtaClick}
        />

        {/* 3. Floating Categories scrollbar */}
        <CategoryBar activeCategory={activeCategory} onCategoryClick={handleCategoryNav} />

        {/* 4. Core Grid Menu layout */}
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-10 flex-1 space-y-16">
          
          {/* Category Blocks */}
          {Object.entries(groupedMenu).map(([categoryKey, items]) => {
            const printableCategory = categoryKey === 'starters' ? 'Starters & Sides' : categoryKey;
            
            return (
              <section
                key={categoryKey}
                ref={sectionRefs[categoryKey as keyof typeof sectionRefs]}
                className="scroll-mt-36"
                id={`category-${categoryKey}`}
              >
                {/* Category Header Decor */}
                <div className="flex items-center gap-3.5 mb-8 pb-3 border-b-2 border-neutral-900">
                  <div className="bg-red-600/10 text-red-500 hover:text-white p-2.5 rounded-xl border border-red-500/15">
                    {categoryKey === 'pizzas' ? (
                      <Pizza className="w-5 h-5" />
                    ) : categoryKey === 'deals' ? (
                      <Sparkles className="w-5 h-5 text-yellow-500 fill-current" />
                    ) : (
                      <Flame className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-normal text-white tracking-wider uppercase">
                      {printableCategory}
                    </h2>
                    <p className="text-neutral-500 text-xs font-sans">
                      Fresh oven-baked items styled and delivered straight in hot-boxes.
                    </p>
                  </div>
                </div>

                {/* Responsive Grid lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onCustomizeClick={(customItem) => setCustomizingItem(customItem)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* 5. Fine Themed Footer */}
        <footer className="bg-neutral-950 border-t border-yellow-500/5 py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Logo Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PizzaMasterLogo size="sm" />
                <div className="leading-none">
                  <span className="block font-display text-base tracking-wider text-white">THE PIZZA</span>
                  <span className="block font-oswald text-[10px] font-bold tracking-[0.2em] text-yellow-500">MASTER</span>
                </div>
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Baked with ultimate mastery! Handcrafted sourdough, spicy localized Phantom marinara sauces, and melted high-durability mozzarella stretch toppings.
              </p>
              <div className="flex gap-4 text-xs font-mono font-bold text-yellow-500">
                <span>EST. 2026</span>
                <span>●</span>
                <span>Karachi, Lahore, Islamabad</span>
              </div>
            </div>

            {/* Quick Support */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                Pizza Master Support
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-red-500" />
                  <span>UAN Branch Hotline: <strong className="text-white">111-339-339</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-yellow-500" />
                  <span>Standard Delivery time: 20-30 Mins</span>
                </li>
                <li className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-500" />
                  <span>Pickup times: Instant 10-15 Mins</span>
                </li>
              </ul>
            </div>

            {/* Branches list */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                Popular Cities
              </h4>
              <p className="text-xs text-neutral-400 leading-normal">
                Karachi Division DHA/Gulshan/Johar, Lahore District DHA/Gulberg/Johar, Islamabad sectors G11/F11, Faisalabad Civil Lines, Multan Boson, Rawalpindi Saddar.
              </p>
            </div>

            {/* Copyrights */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                Disclaimer
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                The Pizza Master Pakistan replica. Built purely for high-fidelity evaluation. All branding elements belong to their respective corporate entities.
              </p>
              <span className="block text-neutral-600 text-[10px] mt-2">
                © 2026 The Pizza Master Pakistan. Developed mockup.
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating back-to-top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 text-white h-11 w-11 rounded-full flex items-center justify-center shadow-lg border border-red-500 transition-all duration-300"
          title="Scroll to Top"
          id="scroll-to-top-btn"
        >
          <ChevronUp className="w-5 h-5 animate-pulse" />
        </button>
      )}

      {/* 6. Product customizer Overlay screen */}
      <CustomizerModal
        item={customizingItem}
        isOpen={customizingItem !== null}
        onClose={() => setCustomizingItem(null)}
      />

      {/* 7. Cart Drawer slide panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutClick={() => setIsCheckoutOpen(true)}
      />

      {/* 8. Multi-stage Checkouts suite */}
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSubmitted}
      />

      {/* 9. Live simulated progress Order tracker dashboard */}
      <OrderTracker isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />


      {/* ========================================================== */}
      {/* 10. Sidebar Interactive Overlay Modals (Gift/User)     */}
      {/* ========================================================== */}

      {/* A. Active Vouchers & Coupons Selection overlay */}
      {isPromoModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsPromoModalOpen(false)}>
            <div
              className="bg-[#0c0d12] border-2 border-yellow-500/20 max-w-md w-full rounded-2xl p-6 relative overflow-hidden text-neutral-100 shadow-2xl space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold sparkling top border line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/10 p-2 rounded-xl border border-yellow-500/20 text-yellow-500">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white tracking-wider uppercase">Active Pizza Vouchers</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">DISCOUNT COUPONS READY TO CLIP</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPromoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:scale-105 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Coupons list */}
              <div className="space-y-4">
                {[
                  {
                    code: 'MASTER50',
                    value: '15% Off Your Pizza',
                    desc: 'Exclusive voucher for newly launched master menu pizzas.',
                    badge: 'RECOMMENDED',
                  },
                  {
                    code: 'LAUNCH2026',
                    value: '20% Off Whole Order',
                    desc: 'Grand launch celebration discount. Applicable on all items.',
                    badge: 'HOT DEAL',
                  },
                  {
                    code: 'FREEBEAST',
                    value: '25% Feast Coupon',
                    desc: 'Massive discount for those seeking our legendary 20" rectangular Beast Banquet.',
                    badge: 'FAMILY COMBO',
                  },
                ].map((promo) => {
                  const isActive = promoCode === promo.code;
                  return (
                    <div
                      key={promo.code}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between items-start gap-4 ${
                        isActive
                          ? 'bg-yellow-500/5 border-yellow-500/30'
                          : 'bg-[#121318] border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div>
                          <span className="text-[9px] bg-yellow-500 text-black font-extrabold px-1.5 py-0.5 rounded font-mono mb-1 inline-block">
                            {promo.badge}
                          </span>
                          <h4 className="font-bold text-white text-base leading-tight">{promo.value}</h4>
                          <p className="text-neutral-500 text-xs mt-0.5 leading-snug">{promo.desc}</p>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs font-semibold px-2 py-1 rounded">
                          {promo.code}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleApplyCouponFromModal(promo.code)}
                        className={`w-full py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-neutral-950 shadow-md shadow-yellow-500/10'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Voucher Applied</span>
                          </>
                        ) : successApplyMsg && copiedCoupon === promo.code ? (
                          <>
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>Applied!</span>
                          </>
                        ) : (
                          <>
                            <Percent className="w-3.5 h-3.5" />
                            <span>Apply Discount</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Toast/Success applied text */}
              {successApplyMsg && (
                <div className="bg-emerald-600/10 border border-emerald-500/30 p-2.5 rounded-xl text-center text-emerald-400 font-bold text-xs font-mono animate-bounce">
                  ✨ {successApplyMsg}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* B. VIP Loyalty Membership Profile Card overlay */}
      {isUserModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsUserModalOpen(false)}>
            <div
              className="bg-[#0c0d12] border-2 border-neutral-800 max-w-sm w-full rounded-2xl p-6 relative overflow-hidden text-neutral-100 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sparkling top border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 text-blue-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white tracking-wider uppercase">Pizza Master Club</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">YOUR ORIGINAL MEMBERSHIP CARD</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:scale-105 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Metallic Golden Glow Pizza Card design */}
              <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-[#1a1c24] to-neutral-950 border border-yellow-500/25 p-5 rounded-2xl text-[#f3e8ff] shadow-xl space-y-6 flex flex-col justify-between">
                {/* Embedded dynamic chip & wifi symbol */}
                <div className="flex justify-between items-center">
                  <div className="w-9 h-7 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md relative opacity-85 shadow border border-yellow-200" />
                  <Sparkle className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>

                {/* Account Credentials */}
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-400 tracking-wider font-mono">PIZZA COMPANION</span>
                  <p className="text-white font-black text-sm tracking-wide lowercase font-mono">mohammed.jazib.hassan@gmail.com</p>
                </div>

                {/* Score panel inside card */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[9px] text-neutral-400 tracking-wider block font-mono">OVEN ELITE LEVEL</span>
                    <span className="text-yellow-500 font-extrabold text-sm tracking-wider">TIER 4 (LEGEND)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-neutral-400 block font-mono">PIZZA COINS</span>
                    <span className="text-white font-mono font-bold text-base">4,850 PZC</span>
                  </div>
                </div>
              </div>

              {/* Club perks overview */}
              <div className="bg-neutral-950/40 p-3.5 rounded-xl border border-neutral-900 text-xs space-y-2.5">
                <span className="font-mono text-yellow-500 text-[10px] block font-extrabold uppercase tracking-wider">Unlocked Club Perks</span>
                <ul className="space-y-2 text-neutral-400 text-[11px] list-disc list-inside">
                  <li>Complimentary Sourdough upgrade on all master pizzas.</li>
                  <li>Double Pizza Coins collected on massive rectangular Beasts.</li>
                  <li>UAN Express cooking route priority channel activated.</li>
                </ul>
              </div>

              <button
                onClick={() => setIsUserModalOpen(false)}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold py-2.5 text-xs rounded-xl border border-neutral-800 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Dismiss Card View</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modern High-Fidelity App Loading Overlay with dynamic logo and progress track */}
      {appLoading && (
        <div className="fixed inset-0 bg-[#07080b] z-[9999] flex flex-col items-center justify-center p-6 transition-all duration-700 select-none">
          <style>{`
            @keyframes progressLoader {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(-20%); }
              100% { transform: translateX(100%); }
            }
            .animate-spin-slow {
              animation: spin-slow-key 12s linear infinite;
            }
            @keyframes spin-slow-key {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          
          {/* Subtle Ambient Golden Glow Behind */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-yellow-500/5 blur-[100px] animate-pulse" />
          
          <div className="flex flex-col items-center max-w-sm w-full space-y-8 relative z-10 text-center">
            {/* Spinning/pulsating Logo wrapper with ring */}
            <div className="relative flex items-center justify-center">
              {/* Outer Golden/Red pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-yellow-500/20 scale-[1.3] animate-ping opacity-25" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/20 scale-[1.1] animate-spin-slow" />
              
              <div className="transform scale-[1.6] animate-pulse duration-1000">
                <PizzaMasterLogo size="md" />
              </div>
            </div>

            {/* Cinematic Typography */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] tracking-[0.3em] font-extrabold font-mono text-red-500 uppercase block">Authentic Sourdough Legacy</span>
              <h2 className="text-3xl font-display text-white tracking-widest font-normal uppercase">THE PIZZA MASTER</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[2px] w-6 bg-red-600 rounded" />
                <span className="text-xs text-neutral-400 font-bold uppercase font-sans tracking-[0.1em]">Kettle Wood-Fired</span>
                <span className="h-[2px] w-6 bg-yellow-500 rounded" />
              </div>
            </div>

            {/* Elegant Modern Custom Loading Track Line Indicator */}
            <div className="w-48 h-[3px] bg-neutral-900 rounded-full overflow-hidden relative border border-neutral-800/40">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-yellow-500 to-amber-500 rounded-full w-full" 
                style={{ animation: 'progressLoader 1.8s ease-in-out infinite' }} 
              />
            </div>

            {/* Under-line status tags */}
            <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              <span>Perfecting cheese-pull parameters...</span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <PizzaMasterMain />
    </CartProvider>
  );
}

