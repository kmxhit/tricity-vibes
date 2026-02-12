import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Building2, Users, ShieldCheck, Zap } from "lucide-react";

const STATS = [
  { icon: Building2, value: "5,000+", label: "Properties Listed" },
  { icon: Users, value: "12K+", label: "Happy Tenants" },
  { icon: ShieldCheck, value: "100%", label: "Verified Owners" },
  { icon: Zap, value: "24hrs", label: "Avg Response Time" },
];

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".stat-item");
    if (!items) return;

    gsap.fromTo(
      Array.from(items),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-4">
      <div className="container mx-auto">
        <div className="glass-card !p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="stat-item text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
              <div className="text-muted-foreground text-xs sm:text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
