import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import TenantDashboard from "./TenantDashboard";
import OwnerDashboard from "./OwnerDashboard";
import AdminDashboard from "./AdminDashboard";
import { useState } from "react";

const Dashboard = () => {
  const { user, loading, roles } = useAuth();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const currentRole = activeRole || roles[0] || "tenant";

  return (
    <div>
      {/* Role switcher if multiple roles */}
      {roles.length > 1 && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 glass-strong rounded-full px-1 py-1 flex gap-1">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                currentRole === role ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      {currentRole === "admin" && <AdminDashboard />}
      {currentRole === "owner" && <OwnerDashboard />}
      {currentRole === "tenant" && <TenantDashboard />}
    </div>
  );
};

export default Dashboard;
