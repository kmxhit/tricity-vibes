import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Single",
    price: "₹99",
    desc: "Ek flat post karo, scene set karo",
    features: ["1 Property Listing", "30 Days Active", "Basic Analytics", "Chat Support"],
    popular: false,
  },
  {
    name: "Flex",
    price: "₹199",
    desc: "Multiple flats? Flex karo bro",
    features: ["5 Property Listings", "60 Days Active", "Priority Views", "Detailed Analytics", "Badge: Trusted Owner"],
    popular: true,
  },
  {
    name: "Broker",
    price: "₹799",
    desc: "Full broker mode activated",
    features: ["Unlimited Listings", "90 Days Active", "Top Search Results", "Full Analytics Dashboard", "Verified Badge", "Direct Tenant Calls"],
    popular: false,
  },
];

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".pricing-card");
    if (!cards) return;

    gsap.fromTo(
      Array.from(cards),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Pricing 💰</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Plans Jo Suit Kare Tujhe
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Owner ho? Apna flat list karo competitive rates pe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card glass-card relative ${plan.popular ? "ring-2 ring-primary glow-purple" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{plan.desc}</p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/listing</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "btn-glow" : "glass hover:bg-white/[0.1] text-foreground"}`}>
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
