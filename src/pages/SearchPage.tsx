import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Search as SearchIcon, MapPin, ChevronDown, SlidersHorizontal, X } from "lucide-react";

const ALL_PROPERTIES = [
  { title: "Spacious 2BHK in Sector 17", location: "Sector 17, Chandigarh", price: "₹18,000", beds: 2, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", tags: ["Verified"], bachelorAllowed: true, parking: true, pets: false },
  { title: "Modern 3BHK with Balcony", location: "Phase 7, Mohali", price: "₹25,000", beds: 3, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", tags: ["Premium"], bachelorAllowed: false, parking: true, pets: true },
  { title: "Cozy 1BHK Studio Flat", location: "Sector 22, Panchkula", price: "₹9,500", beds: 1, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80", tags: ["Budget"], bachelorAllowed: true, parking: false, pets: false },
  { title: "Furnished 2BHK Apartment", location: "Zirakpur Main Road", price: "₹15,000", beds: 2, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80", tags: ["Furnished"], bachelorAllowed: true, parking: true, pets: false },
  { title: "Luxury 3BHK Penthouse", location: "Sector 35, Chandigarh", price: "₹45,000", beds: 3, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", tags: ["Luxury"], bachelorAllowed: false, parking: true, pets: true },
  { title: "Budget 1BHK Near IT Park", location: "Phase 8B, Mohali", price: "₹8,000", beds: 1, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", tags: ["Bachelor OK"], bachelorAllowed: true, parking: false, pets: false },
];

const FILTERS = [
  { key: "bachelor", label: "Bachelor Allowed 🎓" },
  { key: "furnished", label: "Furnished 🛋️" },
  { key: "parking", label: "Parking 🚗" },
  { key: "pets", label: "Pets Allowed 🐾" },
];

const SearchPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;
    gsap.fromTo(
      Array.from(cards),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out" }
    );
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-background gradient-mesh noise-overlay">
      <Navbar />
      <div className="pt-20 pb-24 px-4">
        <div className="container mx-auto">
          {/* Search bar */}
          <div className="glass-strong rounded-2xl p-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/[0.06] rounded-xl px-4 py-3">
                <SearchIcon className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Search sector, locality..."
                  className="bg-transparent text-foreground text-sm outline-none w-full placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`glass rounded-xl p-3 transition-colors ${showFilters ? "bg-primary/20 border-primary/30" : ""}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggleFilter(f.key)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      activeFilters.includes(f.key)
                        ? "bg-primary/30 border border-primary/50 text-foreground"
                        : "glass text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                    {activeFilters.includes(f.key) && (
                      <X className="w-3 h-3 inline ml-1.5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">{ALL_PROPERTIES.length}</span> properties mil gaye
            </p>
            <select className="bg-transparent text-foreground/70 text-sm outline-none">
              <option>Sort: Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* Grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ALL_PROPERTIES.map((property, i) => (
              <PropertyCard key={i} {...property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
