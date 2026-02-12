import { useEffect, useRef } from "react";
import gsap from "gsap";
import PropertyCard from "./PropertyCard";

const FEATURED_PROPERTIES = [
  {
    title: "Spacious 2BHK in Sector 17",
    location: "Sector 17, Chandigarh",
    price: "₹18,000",
    beds: 2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    tags: ["Featured", "Verified"],
    bachelorAllowed: true,
    parking: true,
    pets: false,
  },
  {
    title: "Modern 3BHK with Balcony",
    location: "Phase 7, Mohali",
    price: "₹25,000",
    beds: 3,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tags: ["Premium"],
    bachelorAllowed: false,
    parking: true,
    pets: true,
  },
  {
    title: "Cozy 1BHK Studio Flat",
    location: "Sector 22, Panchkula",
    price: "₹9,500",
    beds: 1,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    tags: ["Budget", "Bachelor OK"],
    bachelorAllowed: true,
    parking: false,
    pets: false,
  },
  {
    title: "Furnished 2BHK Apartment",
    location: "Zirakpur Main Road",
    price: "₹15,000",
    beds: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    tags: ["Furnished"],
    bachelorAllowed: true,
    parking: true,
    pets: false,
  },
];

const FeaturedGems = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      Array.from(cards),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Featured Gems ✨</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Top Picks, Ekdum Solid
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Curated listings jo match kare teri vibe
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_PROPERTIES.map((property, i) => (
            <PropertyCard key={i} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGems;
