import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Plus, Eye, MessageCircle, Home, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Basic Info", "Details", "Pricing & Submit"];

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", location: "", sector: "", city: "Chandigarh",
    price: "", bhk: "2", furnished: false, parking: false, pets_allowed: false, bachelor_allowed: false,
  });

  useEffect(() => {
    if (user) fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setProperties(data);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.price) {
      toast.error("Bhai required fields toh bhar de");
      return;
    }
    const { error } = await supabase.from("properties").insert({
      owner_id: user!.id,
      title: form.title,
      description: form.description,
      location: form.location,
      sector: form.sector,
      city: form.city,
      price: parseInt(form.price),
      bhk: parseInt(form.bhk),
      furnished: form.furnished,
      parking: form.parking,
      pets_allowed: form.pets_allowed,
      bachelor_allowed: form.bachelor_allowed,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Property posted! Approval pending ⏳");
      setShowForm(false);
      setStep(0);
      setForm({ title: "", description: "", location: "", sector: "", city: "Chandigarh", price: "", bhk: "2", furnished: false, parking: false, pets_allowed: false, bachelor_allowed: false });
      fetchProperties();
    }
  };

  const totalVibes = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);

  const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div>
      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange }: any) => (
    <label className="flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer">
      <span className="text-sm text-foreground/80">{label}</span>
      <div className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-primary" : "bg-white/10"}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${checked ? "left-5" : "left-1"}`} />
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );

  return (
    <div className="min-h-screen bg-background gradient-mesh noise-overlay">
      <Navbar />
      <div className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Owner Dashboard 🏠</h1>
              <p className="text-muted-foreground text-sm">Apni properties manage karo</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-glow flex items-center gap-2 !py-2 !px-4 text-sm">
              <Plus className="w-4 h-4" /> Post Flat
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass-card text-center !p-4">
              <Home className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="font-display text-xl font-bold text-foreground">{properties.length}</div>
              <div className="text-muted-foreground text-[10px]">Total Listings</div>
            </div>
            <div className="glass-card text-center !p-4">
              <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="font-display text-xl font-bold text-foreground">{totalVibes}</div>
              <div className="text-muted-foreground text-[10px]">Total Vibes</div>
            </div>
            <div className="glass-card text-center !p-4">
              <MessageCircle className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="font-display text-xl font-bold text-foreground">0</div>
              <div className="text-muted-foreground text-[10px]">Inquiries</div>
            </div>
          </div>

          {/* Multi-step form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
              <div className="glass-strong rounded-2xl p-6 w-full max-w-lg glow-purple-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-bold text-foreground">Post Property</h2>
                  <button onClick={() => { setShowForm(false); setStep(0); }} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-6">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-white/10"}`} />
                      <p className={`text-[10px] mt-1 ${i <= step ? "text-foreground/80" : "text-muted-foreground"}`}>{s}</p>
                    </div>
                  ))}
                </div>

                {step === 0 && (
                  <div className="space-y-4">
                    <InputField label="Property Title *" value={form.title} onChange={(e: any) => setForm({...form, title: e.target.value})} placeholder="e.g., Spacious 2BHK in Sector 17" />
                    <InputField label="Location *" value={form.location} onChange={(e: any) => setForm({...form, location: e.target.value})} placeholder="e.g., Sector 17, Chandigarh" />
                    <InputField label="Sector" value={form.sector} onChange={(e: any) => setForm({...form, sector: e.target.value})} placeholder="e.g., Sector 17" />
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">City</label>
                      <select value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-foreground outline-none">
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Mohali">Mohali</option>
                        <option value="Panchkula">Panchkula</option>
                        <option value="Zirakpur">Zirakpur</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Tell more about the property..." rows={3} className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">BHK</label>
                      <select value={form.bhk} onChange={(e) => setForm({...form, bhk: e.target.value})} className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-foreground outline-none">
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4+ BHK</option>
                      </select>
                    </div>
                    <Toggle label="Furnished 🛋️" checked={form.furnished} onChange={() => setForm({...form, furnished: !form.furnished})} />
                    <Toggle label="Parking 🚗" checked={form.parking} onChange={() => setForm({...form, parking: !form.parking})} />
                    <Toggle label="Pets Allowed 🐾" checked={form.pets_allowed} onChange={() => setForm({...form, pets_allowed: !form.pets_allowed})} />
                    <Toggle label="Bachelor Allowed 🎓" checked={form.bachelor_allowed} onChange={() => setForm({...form, bachelor_allowed: !form.bachelor_allowed})} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <InputField label="Monthly Rent (₹) *" value={form.price} onChange={(e: any) => setForm({...form, price: e.target.value})} placeholder="e.g., 15000" type="number" />
                    <div className="glass-card !p-4 space-y-2">
                      <h3 className="font-display font-semibold text-foreground text-sm">Summary</h3>
                      <p className="text-muted-foreground text-xs">{form.title || "Untitled"} • {form.bhk} BHK • {form.city}</p>
                      <p className="text-muted-foreground text-xs">{form.location}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.furnished && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Furnished</span>}
                        {form.parking && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Parking</span>}
                        {form.bachelor_allowed && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Bachelor OK</span>}
                        {form.pets_allowed && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Pets OK</span>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="glass px-4 py-2 rounded-xl text-sm text-foreground/70 disabled:opacity-30 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  {step < 2 ? (
                    <button onClick={() => setStep(step + 1)} className="btn-glow !py-2 !px-5 text-sm flex items-center gap-1">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} className="btn-glow !py-2 !px-5 text-sm flex items-center gap-1">
                      Submit <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Property list */}
          <div className="space-y-3">
            {properties.length === 0 ? (
              <div className="glass-card text-center py-12">
                <Home className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Abhi tak koi property post nahi ki</p>
                <button onClick={() => setShowForm(true)} className="btn-glow mt-4 !py-2 !px-5 text-sm">Post Your First Flat</button>
              </div>
            ) : (
              properties.map((p) => (
                <div key={p.id} className="glass-card-hover !p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">{p.title}</h3>
                      <p className="text-muted-foreground text-xs">{p.location} • {p.bhk} BHK</p>
                      <p className="text-primary text-sm font-semibold mt-1">₹{p.price?.toLocaleString()}/mo</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        p.status === "approved" ? "bg-green-500/20 text-green-400" :
                        p.status === "rejected" ? "bg-destructive/20 text-destructive" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {p.status}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
                        <Eye className="w-3 h-3" /> {p.views_count} vibes
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
