import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Menu, X, Home, Heart, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add("bg-white/[0.08]", "backdrop-blur-2xl");
          navRef.current.classList.remove("bg-transparent");
        } else {
          navRef.current.classList.remove("bg-white/[0.08]", "backdrop-blur-2xl");
          navRef.current.classList.add("bg-transparent");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/[0.06] transition-all duration-500"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-display font-bold text-foreground text-sm">
              GB
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Galliboyz
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">Home</Link>
            <Link to="/search" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">Search</Link>
            <Link to="/dashboard" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">Dashboard</Link>
            <Link to="/auth" className="btn-glow text-sm !py-2 !px-4">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl glass"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass-strong border-t border-white/[0.08] p-4 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-foreground/80 hover:bg-white/[0.06] transition-colors font-medium">Home</Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-foreground/80 hover:bg-white/[0.06] transition-colors font-medium">Search Flats</Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-foreground/80 hover:bg-white/[0.06] transition-colors font-medium">Post Property</Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="block btn-glow text-center text-sm mt-2">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/[0.1] px-2 py-2">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 py-1 px-3 text-foreground/60 hover:text-primary transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-1 px-3 text-foreground/60 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-1 px-3 text-foreground/60 hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Saved</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-1 px-3 text-foreground/60 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
