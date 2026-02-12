import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { ShieldCheck, CheckCircle, XCircle, Users, Home, Clock } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingProps, setPendingProps] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<"moderation" | "users">("moderation");

  useEffect(() => {
    if (user) {
      fetchPending();
      fetchUsers();
    }
  }, [user]);

  const fetchPending = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (data) setPendingProps(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*, roles:user_roles(role)")
      .order("created_at", { ascending: false });
    if (data) setAllUsers(data);
  };

  const handleModeration = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("properties").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Property ${status}!`);
      setPendingProps((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh noise-overlay">
      <Navbar />
      <div className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Admin Panel 🛡️</h1>
              <p className="text-muted-foreground text-sm">Moderation aur user management</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("moderation")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "moderation" ? "bg-primary/20 border border-primary/40 text-foreground" : "glass text-foreground/60"
              }`}
            >
              <Clock className="w-4 h-4" /> Moderation Queue ({pendingProps.length})
            </button>
            <button
              onClick={() => setTab("users")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === "users" ? "bg-primary/20 border border-primary/40 text-foreground" : "glass text-foreground/60"
              }`}
            >
              <Users className="w-4 h-4" /> Users ({allUsers.length})
            </button>
          </div>

          {tab === "moderation" && (
            <div className="space-y-3">
              {pendingProps.length === 0 ? (
                <div className="glass-card text-center py-12">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="text-muted-foreground">Sab clear hai! Koi pending listing nahi</p>
                </div>
              ) : (
                pendingProps.map((p) => (
                  <div key={p.id} className="glass-card !p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground text-sm">{p.title}</h3>
                        <p className="text-muted-foreground text-xs">{p.location} • {p.bhk} BHK • ₹{p.price?.toLocaleString()}/mo</p>
                        <p className="text-muted-foreground text-[10px] mt-1">
                          {new Date(p.created_at).toLocaleDateString()}
                        </p>
                        {p.description && <p className="text-foreground/60 text-xs mt-2 line-clamp-2">{p.description}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleModeration(p.id, "approved")}
                          className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleModeration(p.id, "rejected")}
                          className="flex items-center gap-1.5 bg-destructive/20 hover:bg-destructive/30 text-destructive px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-3">
              {allUsers.map((u) => (
                <div key={u.id} className="glass-card !p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm">{u.display_name || "No Name"}</h3>
                    <p className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {u.roles?.map((r: any) => (
                      <span key={r.role} className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        r.role === "admin" ? "bg-purple-500/20 text-purple-400" :
                        r.role === "owner" ? "bg-blue-500/20 text-blue-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {r.role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
