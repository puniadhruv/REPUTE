import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import {
  LayoutDashboard, Upload, BarChart3, Award, Shield, User, Menu, X, CreditCard,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/upload", label: "Upload", icon: Upload },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/score", label: "Score", icon: Award },
  { path: "/blockchain", label: "Blockchain", icon: Shield },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg trust-gradient-bg flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground"><span className="font-display font-bold text-foreground">REPUTE</span></span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-card pt-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
