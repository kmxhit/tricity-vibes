import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Search, MapPin, ChevronDown } from "lucide-react";

const HeroSearch = () => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={searchRef} className="w-full max-w-2xl mx-auto opacity-0">
      <div className="glass-strong rounded-2xl p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 flex items-center gap-2 bg-white/[0.06] rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <select className="bg-transparent text-foreground text-sm outline-none w-full appearance-none cursor-pointer">
              <option value="">Sector Select Karo</option>
              <option value="chandigarh">Chandigarh</option>
              <option value="mohali">Mohali</option>
              <option value="panchkula">Panchkula</option>
              <option value="zirakpur">Zirakpur</option>
            </select>
            <ChevronDown className="w-4 h-4 text-foreground/40 shrink-0" />
          </div>

          {/* BHK */}
          <div className="flex items-center gap-2 bg-white/[0.06] rounded-xl px-4 py-3 sm:w-32">
            <select className="bg-transparent text-foreground text-sm outline-none w-full appearance-none cursor-pointer">
              <option value="">BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
            <ChevronDown className="w-4 h-4 text-foreground/40 shrink-0" />
          </div>

          {/* Search button */}
          <button className="btn-glow flex items-center justify-center gap-2 !rounded-xl sm:!px-8">
            <Search className="w-4 h-4" />
            <span className="sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
