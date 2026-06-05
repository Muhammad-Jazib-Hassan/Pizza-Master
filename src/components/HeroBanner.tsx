import React, { useState, useEffect } from 'react';
import heroImage from '../assets/images/pizza_master_hero_1780673075722.png';
import { Sparkles, Flame, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onDealClick: (dealId: string) => void;
}

interface Slide {
  id: number;
  badge: { icon: React.ReactNode; text: string; bg: string; textCol: string };
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  actionType: 'explore' | 'deal';
  dealId?: string;
  accentColor: string; // Tailwind glow class
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onDealClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      badge: {
        icon: <Flame className="w-3.5 h-3.5" />,
        text: 'HOSTING PAKISTAN\'S BIGGEST SLICE',
        bg: 'bg-red-600/25 border-red-500/40 text-red-500',
        textCol: 'text-red-400',
      },
      title: 'SLICES SO HUGE, THEY DESERVE THE CROWN OF PIZZA MASTERS!',
      subtitle: 'Premium Gourmet Pizza Master Oven-Baked Pizzas',
      description: 'Hand-stretched premium sourdough base layered with signature Phantom black-pepper sauce or extreme tikka chunks, loaded with extra mozzarella ropes.',
      image: heroImage,
      ctaText: 'Order Signature Pizzas',
      actionType: 'explore',
      accentColor: 'from-red-600/30 to-rose-600/10',
    },
    {
      id: 2,
      badge: {
        icon: <Sparkles className="w-3.5 h-3.5 text-yellow-500" />,
        text: 'AMAZING VALUE COMBO',
        bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
        textCol: 'text-yellow-400',
      },
      title: 'THE PIZZA MASTER DOUBLE TROUBLE COMBO',
      subtitle: '2 Medium Pizzas + Starters + Cola for PKR 1,990',
      description: 'Pick any 2 epic flavors like Wicked Sriracha or West Side Ranch. Comes with a garlic bread side and a cold drink bottle!',
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Order Double Combo Now',
      actionType: 'deal',
      dealId: 'deal_duo',
      accentColor: 'from-yellow-600/20 to-amber-600/5',
    },
    {
      id: 3,
      badge: {
        icon: <Clock className="w-3.5 h-3.5 text-orange-500" />,
        text: 'UNLEASH THE BEAST',
        bg: 'bg-orange-500/15 border-orange-500/30 text-orange-500',
        textCol: 'text-orange-400',
      },
      title: 'PAKISTAN\'S LARGEST 20-INCH BEAST PIZZA',
      subtitle: 'Massive Rectangular Slices of Absolute Heaven',
      description: 'Unleash the 20" Pizza Master Beast Feast with 12 massive customized slices fit for the ultimate group party banquet.',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Taste the Beast (XL)',
      actionType: 'deal',
      dealId: 'deal_beast',
      accentColor: 'from-orange-600/25 to-yellow-600/5',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Cycle after 7 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative bg-neutral-950 overflow-hidden border-b border-neutral-900" id="hero-banner-section">
      {/* Background glow filters */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10"></div>
      
      {/* Dynamic Slide Canvas */}
      <div className="relative h-[480px] sm:h-[520px] lg:h-[600px] w-full flex items-center">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-1000 transform ${
              idx === currentSlide 
                ? 'opacity-100 scale-100 translate-x-0 z-20' 
                : 'opacity-0 scale-95 translate-x-12 pointer-events-none z-0'
            }`}
          >
            {/* Background image & cover */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-102 transform filter brightness-[0.25] saturate-[1.1] transition-all duration-[7000ms]"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} mix-blend-multiply`}></div>
              {/* Radial warm lighting spotlights */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            {/* Slide Content wrapper */}
            <div className="max-w-7xl mx-auto w-full px-4 lg:px-6 relative z-30 flex flex-col justify-center h-full">
              <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
                
                {/* Micro badge chip */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider font-semibold uppercase ${slide.badge.bg}`}>
                  {slide.badge.icon}
                  <span>{slide.badge.text}</span>
                </div>

                {/* Main Heading title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-normal text-white tracking-wide leading-none drop-shadow-md">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <h2 className="text-lg sm:text-2xl font-oswald font-medium tracking-wide text-yellow-400 uppercase">
                  {slide.subtitle}
                </h2>

                {/* Description paragraphs */}
                <p className="text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                {/* CTA Elements */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (slide.actionType === 'explore') {
                        onExploreClick();
                      } else if (slide.actionType === 'deal' && slide.dealId) {
                        onDealClick(slide.dealId);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs sm:text-sm font-black px-7 py-3.5 rounded-full shadow-xl shadow-red-700/20 active:scale-95 transition-all flex items-center gap-2 group border border-red-500"
                    id={`hero-cta-btn-${slide.id}`}
                  >
                    <span>{slide.ctaText}</span>
                    <Play className="w-3.5 h-3.5 fill-current transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onExploreClick}
                    className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-200 font-sans text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full hover:text-white transition-all backdrop-blur-sm"
                    id={`hero-secondary-btn-${slide.id}`}
                  >
                    Full Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Control sliders buttons */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={prev}
          className="w-9 h-9 items-center justify-center rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all hidden sm:flex"
          id="hero-banner-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="w-9 h-9 items-center justify-center rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all hidden sm:flex"
          id="hero-banner-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators bar (bullets bottom center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/45 px-3 py-1.5 rounded-full backdrop-blur-sm">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-6 bg-red-600' : 'w-2 bg-neutral-600 hover:bg-neutral-500'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};
