import { motion } from "framer-motion";
import { Phone, Wallet, Clock, Upload, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import TierBadge from "@/components/TierBadge";
import { Button } from "@/components/ui/button";

const scoreHistory = [
  { date: "2026-03-07", score: 78, tier: "B" },
  { date: "2026-02-01", score: 72, tier: "B" },
  { date: "2025-12-15", score: 65, tier: "C" },
  { date: "2025-10-20", score: 58, tier: "C" },
];

const Profile = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground text-sm mb-8">Your account information and score history</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="trust-card lg:col-span-1">
            <div className="w-16 h-16 rounded-full trust-gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-display font-bold text-primary-foreground">JD</span>
            </div>
            <h2 className="font-display font-semibold text-center text-foreground mb-6">Jane Doe</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wallet ID</p>
                  <p className="text-sm font-medium text-foreground font-mono">0x7a3F...8dE2</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium text-foreground">October 2025</p>
                </div>
              </div>
            </div>
            <Link to="/upload" className="block mt-6">
              <Button className="w-full trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
                <Upload className="w-4 h-4" /> Upload New Statement
              </Button>
            </Link>
          </div>

          {/* Score History */}
          <div className="trust-card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-foreground">Score History</h2>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {scoreHistory.map((entry, i) => (
                  <motion.div
                    key={entry.date}
                    className="flex items-start gap-4 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      i === 0 ? "trust-gradient-bg" : "bg-secondary"
                    }`}>
                      <span className={`text-xs font-bold ${i === 0 ? "text-primary-foreground" : "text-muted-foreground"}`}>
                        {entry.score}
                      </span>
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-foreground">Score: {entry.score}/100</span>
                        <TierBadge tier={entry.tier} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
