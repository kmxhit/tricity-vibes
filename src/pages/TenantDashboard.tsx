import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Heart, MessageCircle, Clock, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [savedProps, setSavedProps] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [tab, setTab] = useState<"saved" | "inquiries">("saved");

  useEffect(() => {
    if (!user) return;
    fetchSaved();
    fetchInquiries();
  }, [user]);

  const fetchSaved = async () => {
    const { data } = await supabase
      .from("saved_properties")
      .select("*, property:properties(*)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setSavedProps(data);
  };

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from("inquiries")
      .select("*, property:properties(title, location)")
      .eq("tenant_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setInquiries(data);
  };

  const removeSaved = async (id: string) => {
    await supabase.from("saved_properties").delete().eq("id", id);
    setSavedProps((prev) => prev.filter((s) => s.id !== id));
    toast.success("Removed from stash");
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh noise-overlay">
      <Navbar />
      <div className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Tenant Dashboard 🎓
          </h1>
          <p className="text-muted-foreground text-sm mb-6">Apna stash aur inquiry history yahan hai</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "saved" as const, label: "Saved Stash", icon: Heart },
              { key: "inquiries" as const, label: "Inquiry History", icon: MessageCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === key ? "bg-primary/20 border border-primary/40 text-foreground" : "glass text-foreground/60"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {tab === "saved" && (
            <div className="space-y-3">
              {savedProps.length === 0 ? (
                <div className="glass-card text-center py-12">
                  <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Koi property save nahi ki abhi tak</p>
                </div>
              ) : (
                savedProps.map((s) => (
                  <div key={s.id} className="glass-card-hover flex items-center gap-4 !p-4">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground text-sm">{s.property?.title}</h3>
                      <p className="text-muted-foreground text-xs">{s.property?.location}</p>
                      <p className="text-primary text-sm font-semibold mt-1">₹{s.property?.price?.toLocaleString()}/mo</p>
                    </div>
                    <button onClick={() => removeSaved(s.id)} className="p-2 glass rounded-lg hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "inquiries" && (
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="glass-card text-center py-12">
                  <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Koi inquiry nahi bheji abhi tak</p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="glass-card !p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-sm">{inq.property?.title}</h3>
                        <p className="text-muted-foreground text-xs mt-0.5">{inq.message}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        inq.status === "replied" ? "bg-green-500/20 text-green-400" :
                        inq.status === "read" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-white/10 text-foreground/50"
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-2">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
