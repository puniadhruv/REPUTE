import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import CreditScoreRing from "@/components/CreditScoreRing";
import ScoreBreakdownBar from "@/components/ScoreBreakdownBar";
import TierBadge from "@/components/TierBadge";
import { Button } from "@/components/ui/button";
import { useRepute } from "@/context/ReputeContext";

const explanations = [
  "Your rent payments have been consistently on time for 6 months.",
  "Utility payments show strong reliability with only 1 minor delay.",
  "Steady income presence detected across all analyzed months.",
  "No suspicious or fraudulent transaction patterns found.",
];

const ScoreResult = () => {
  const { walletAddress, lastScoreResult } = useRepute();

  // Use backend result if available; otherwise show placeholder and prompt to upload
  const score = lastScoreResult?.score ?? 0;
  const tier = lastScoreResult?.tier ?? "Good";
  const proofHash = lastScoreResult?.proofHash ?? "";
  const hasResult = !!lastScoreResult;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Credit Score Result
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your behavior-based credit assessment
          {hasResult && " (stored on blockchain)"}
        </p>

        {!hasResult && !walletAddress && (
          <div className="trust-card max-w-2xl mb-6 p-6">
            <p className="text-muted-foreground mb-4">
              Connect your wallet and upload a CSV to generate your credit
              score.
            </p>
            <Link to="/upload">
              <Button className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
                Go to Upload
              </Button>
            </Link>
          </div>
        )}

        {!hasResult && walletAddress && (
          <div className="trust-card max-w-2xl mb-6 p-6">
            <p className="text-muted-foreground mb-4">
              Upload a CSV statement to calculate and store your reputation
              on-chain.
            </p>
            <Link to="/upload">
              <Button className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
                Upload Statement
              </Button>
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="trust-card flex flex-col items-center py-12 trust-glow">
            <CreditScoreRing
              score={score}
              tier={tier}
              size={260}
              maxScore={900}
            />
            <div className="mt-6">
              <TierBadge tier={tier} size="lg" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs">
              Your behavioral credit score (300–900). Stored on blockchain with
              proof hash.
            </p>
            {proofHash && (
              <p className="mt-2 text-xs font-mono text-muted-foreground break-all max-w-xs">
                {proofHash}
              </p>
            )}
            <Link to="/blockchain" className="mt-6">
              <Button className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2">
                View Blockchain Proof <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="trust-card">
              <h2 className="font-display font-semibold text-foreground mb-5">
                Score Components
              </h2>
              <div className="space-y-5">
                <ScoreBreakdownBar
                  label="Rent Reliability"
                  value={85}
                  color="hsl(152, 60%, 50%)"
                  delay={0}
                />
                <ScoreBreakdownBar
                  label="Utility Payments"
                  value={72}
                  color="hsl(174, 62%, 47%)"
                  delay={0.15}
                />
                <ScoreBreakdownBar
                  label="Income Presence"
                  value={90}
                  color="hsl(262, 52%, 47%)"
                  delay={0.3}
                />
                <ScoreBreakdownBar
                  label="Fraud-Free Behavior"
                  value={65}
                  color="hsl(38, 92%, 50%)"
                  delay={0.45}
                />
              </div>
            </div>

            <div className="trust-card">
              <h2 className="font-display font-semibold text-foreground mb-4">
                Score Explanation
              </h2>
              <div className="space-y-3">
                {explanations.map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-trust-green mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-trust-teal/5 border border-trust-teal/20">
              <Info className="w-4 h-4 text-trust-teal mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your credit proof can be shared with lenders and financial
                institutions as a verifiable credential on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ScoreResult;
