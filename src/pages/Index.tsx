import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import FeaturedGems from "@/components/FeaturedGems";
import StatsSection from "@/components/StatsSection";
import PricingSection from "@/components/PricingSection";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(tagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
      .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 gradient-mesh" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <span ref={tagRef} className="inline-block glass text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full text-foreground/80 mb-6 opacity-0">
            🏠 Tricity ka #1 Real Estate Platform
          </span>

          <h1 ref={headingRef} className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6 opacity-0">
            <span className="text-foreground">Gali Gali Ghoomna</span>
            <br />
            <span className="gradient-text-brand">Stop Karo.</span>
            <br />
            <span className="text-foreground">Proper Scene</span>{" "}
            <span className="gradient-text-brand">Set Karo.</span>
          </h1>

          <p ref={subRef} className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-0">
            Flat chahiye? Gali gali ghoomne ki zarurat nahi. Chandigarh, Mohali, Panchkula — sab ek jagah.
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/search" className="btn-glow flex items-center gap-2">
              Explore Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="glass px-6 py-3 rounded-xl text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
              Post Your Property
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-float">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Featured */}
      <FeaturedGems />

      {/* Pricing */}
      <PricingSection />

      {/* CTA Footer */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="glass-card max-w-2xl mx-auto !p-10 glow-purple">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to Find Your Spot? 🔥
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Tenant ho ya Owner — Galliboyz pe sab ka scene set hota hai.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/search" className="btn-glow w-full sm:w-auto flex items-center justify-center gap-2">
                Start Searching <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="glass w-full sm:w-auto px-6 py-3 rounded-xl text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-display font-bold text-foreground text-[10px]">GB</div>
            <span className="font-display font-semibold text-foreground/80 text-sm">Galliboyz</span>
          </div>
          <p className="text-muted-foreground text-xs">© 2026 Galliboyz. Tricity ka apna real estate scene.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
