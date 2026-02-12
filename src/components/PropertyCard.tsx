import { useEffect, useRef, useState } from "react";
import { Heart, MapPin, Bed, Car, PawPrint } from "lucide-react";
import gsap from "gsap";

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  beds: number;
  image: string;
  tags: string[];
  bachelorAllowed?: boolean;
  parking?: boolean;
  pets?: boolean;
}

const PropertyCard = ({ title, location, price, beds, image, tags, bachelorAllowed, parking, pets }: PropertyCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    if (heartRef.current && !liked) {
      gsap.fromTo(heartRef.current, 
        { scale: 1 }, 
        { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleEnter = () => {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      gsap.to(card.querySelector(".card-glow"), { opacity: 1, duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(card.querySelector(".card-glow"), { opacity: 0, duration: 0.3 });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="glass-card group cursor-pointer relative overflow-hidden !p-0">
      {/* Glow overlay */}
      <div className="card-glow absolute inset-0 rounded-2xl opacity-0 pointer-events-none" style={{ boxShadow: "inset 0 0 60px -20px hsl(265 90% 55% / 0.2)" }} />
      
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="glass text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-foreground/90">
              {tag}
            </span>
          ))}
        </div>

        {/* Heart */}
        <button
          ref={heartRef}
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          className="absolute top-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="font-display font-bold text-xl text-foreground">{price}</span>
          <span className="text-foreground/50 text-sm">/mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-semibold text-foreground text-base leading-tight">{title}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1 text-foreground/60 text-xs">
            <Bed className="w-3.5 h-3.5" /> {beds} BHK
          </div>
          {bachelorAllowed && (
            <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Bachelor OK</span>
          )}
          {parking && <Car className="w-3.5 h-3.5 text-foreground/50" />}
          {pets && <PawPrint className="w-3.5 h-3.5 text-foreground/50" />}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
