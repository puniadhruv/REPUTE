import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Clock, Upload, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import CreditScoreRing from "@/components/CreditScoreRing";
import ScoreBreakdownBar from "@/components/ScoreBreakdownBar";
import TierBadge from "@/components/TierBadge";
import { Button } from "@/components/ui/button";
import { useRepute } from "@/context/ReputeContext";
import { getReputation, type ReputationResponse } from "@/lib/reputeApi";

const defaultComponents = [
  { label: "Rent Reliability", value: 85, color: "hsl(152, 60%, 50%)" },
  { label: "Utility Payment Behavior", value: 72, color: "hsl(174, 62%, 47%)" },
  { label: "Income Presence", value: 90, color: "hsl(262, 52%, 47%)" },
  { label: "Fraud-Free Behavior", value: 65, color: "hsl(38, 92%, 50%)" },
];

const Dashboard = () => {
  const { walletAddress, connectWallet, isConnecting, lastScoreResult } =
    useRepute();
  const [reputation, setReputation] = useState<ReputationResponse | null>(null);
  const [loadingReputation, setLoadingReputation] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setReputation(null);
      return;
    }
    let cancelled = false;
    setLoadingReputation(true);
    getReputation(walletAddress)
      .then((data) => {
        if (!cancelled) setReputation(data);
      })
      .catch(() => {
        if (!cancelled) setReputation(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingReputation(false);
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  // Prefer last score result (numeric score) for the ring; otherwise use reputation tier only (no score number from chain)
  const displayScore = lastScoreResult?.score ?? 0;
  const displayTier = lastScoreResult?.tier ?? reputation?.tier ?? "—";
  const validUntil = reputation?.timestamp
    ? new Date(reputation.timestamp * 1000).toLocaleDateString()
    : "—";

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Credit Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your decentralized credit identity at a glance
            </p>
          </div>
          <Link to="/upload">
            <Button className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
              <Upload className="w-4 h-4" /> Upload Statement
            </Button>
          </Link>
        </div>

        {!walletAddress && (
          <div className="trust-card max-w-2xl mb-6 p-6">
            <p className="text-muted-foreground mb-3">
              Connect your wallet to see your on-chain reputation and upload
              statements.
            </p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90"
            >
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="trust-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-trust-teal/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-trust-teal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wallet ID</p>
              <p className="font-display font-semibold text-foreground">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="trust-card flex items-center gap-4">
            <TierBadge tier={displayTier} size="lg" />
          </div>

          <div className="trust-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-trust-amber/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-trust-amber" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Record timestamp</p>
              <p className="font-display font-semibold text-foreground">
                {validUntil}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="trust-card flex flex-col items-center justify-center py-10">
            <h2 className="text-lg font-display font-semibold text-foreground mb-6">
              Credit Score
            </h2>
            <CreditScoreRing
              score={displayScore}
              tier={displayTier}
              size={220}
              maxScore={900}
            />
            <div className="mt-4">
              <TierBadge tier={displayTier} />
            </div>
          </div>

          <div className="trust-card">
            <h2 className="text-lg font-display font-semibold text-foreground mb-6">
              Score Breakdown
            </h2>
            <div className="space-y-5">
              {defaultComponents.map((c, i) => (
                <ScoreBreakdownBar
                  key={c.label}
                  label={c.label}
                  value={c.value}
                  color={c.color}
                  delay={i * 0.15}
                />
              ))}
            </div>
            <Link
              to="/score"
              className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-trust-teal hover:underline"
            >
              View full report <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
