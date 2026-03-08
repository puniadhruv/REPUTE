import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import TierBadge from "@/components/TierBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRepute } from "@/context/ReputeContext";
import { getReputation, type ReputationResponse } from "@/lib/reputeApi";

const BlockchainIdentity = () => {
  const { walletAddress, lastScoreResult } = useRepute();
  const [reputation, setReputation] = useState<ReputationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setReputation(null);
      return;
    }
    setLoading(true);
    getReputation(walletAddress)
      .then(setReputation)
      .catch(() => setReputation(null))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Prefer last score result for tier/proofHash; fallback to fetched reputation
  const tier = lastScoreResult?.tier ?? reputation?.tier ?? "—";
  const proofHash = lastScoreResult?.proofHash ?? reputation?.proofHash ?? "—";
  const timestamp = reputation?.timestamp;
  const displayWallet = walletAddress ?? reputation?.wallet ?? "—";

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Blockchain Credit Identity
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your on-chain verified credit proof (from REPUTE backend)
        </p>

        {!walletAddress && (
          <div className="trust-card max-w-2xl mb-6 p-6">
            <p className="text-muted-foreground">
              Connect your wallet to view your blockchain credit identity.
            </p>
          </div>
        )}

        {walletAddress && loading && (
          <div className="trust-card max-w-2xl mb-6 p-6">
            <p className="text-muted-foreground">Loading reputation...</p>
          </div>
        )}

        {/* Verification Badge */}
        <div className="trust-card max-w-2xl mx-auto mb-8 text-center py-10 trust-glow animate-pulse-glow">
          <div className="w-20 h-20 rounded-full trust-gradient-bg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-trust-green" />
            <span className="font-display font-bold text-lg text-foreground">
              Verified on Blockchain
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            This credit identity is stored and verified via the REPUTE smart
            contract.
          </p>
          <div className="mt-4">
            <TierBadge tier={tier} size="lg" />
          </div>
        </div>

        {/* Details */}
        <div className="trust-card max-w-2xl mx-auto">
          <h2 className="font-display font-semibold text-foreground mb-6">
            Credential Details
          </h2>
          <div className="space-y-5">
            {[
              {
                label: "Wallet Address",
                value: displayWallet,
              },
              { label: "Credit Tier", value: tier },
              { label: "Proof Hash", value: proofHash },
              {
                label: "Timestamp",
                value: timestamp
                  ? new Date(timestamp * 1000).toLocaleString()
                  : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium text-foreground break-all">
                    {item.value}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(String(item.value), item.label)
                    }
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" /> View on Explorer
            </Button>
            <Button className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
              <Shield className="w-4 h-4" /> Share Credit Proof
            </Button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default BlockchainIdentity;
