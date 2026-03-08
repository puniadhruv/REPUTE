import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Award,
  Shield,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/upload", label: "Upload Statement", icon: Upload },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/score", label: "Credit Score", icon: Award },
  { path: "/blockchain", label: "Blockchain ID", icon: Shield },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-border bg-card p-6">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg trust-gradient-bg flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-lg text-foreground"><span className="font-display font-bold text-lg text-foreground">REPUTE</span></span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Link>
    </aside>
  );
};

export default DashboardSidebar;
