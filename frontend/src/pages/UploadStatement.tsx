import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, X, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRepute } from "@/context/ReputeContext";
import { uploadCsv, submitScore } from "@/lib/reputeApi";
import { toast } from "sonner";

const UploadStatement = () => {
  const navigate = useNavigate();
  const { walletAddress, isConnecting, connectWallet, setLastScoreResult } =
    useRepute();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "csv") {
      setFile(f);
      setProgress(0);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    // Backend only accepts CSV for scoring
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv") {
      toast.error("Scoring engine only accepts CSV files. Please upload a CSV.");
      return;
    }

    setUploading(true);
    setProgress(10);
    try {
      const { filePath } = await uploadCsv(file);
      setProgress(50);
      const result = await submitScore(walletAddress, filePath);
      setLastScoreResult(result);
      setProgress(100);
      toast.success("Score calculated and stored on blockchain.");
      navigate("/score");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : null;
      toast.error(message || "Upload or scoring failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Upload Bank Statement
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Upload your transaction history (CSV) to analyze and store your
          credit reputation on-chain
        </p>

        {/* Wallet connect */}
        {!walletAddress && (
          <div className="trust-card max-w-2xl mb-6 p-4 rounded-lg bg-trust-amber/5 border border-trust-amber/20">
            <p className="text-sm text-muted-foreground mb-3">
              Connect your wallet to link your score to your blockchain identity.
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
        {walletAddress && (
          <p className="text-sm text-muted-foreground mb-4">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        )}

        <div className="trust-card max-w-2xl">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
              dragOver
                ? "border-trust-teal bg-trust-teal/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.csv"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
            <div className="w-14 h-14 rounded-xl bg-trust-teal/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-trust-teal" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Drag & drop your statement here
            </p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-3">
              CSV required for scoring (PDF accepted for upload only)
            </p>
          </div>

          <div className="flex items-start gap-3 mt-6 p-4 rounded-lg bg-trust-amber/5 border border-trust-amber/20">
            <AlertCircle className="w-4 h-4 text-trust-amber mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Minimum 6 months of transaction history recommended for accurate
              scoring. Backend runs the REPUTE scoring engine and stores the
              result on blockchain.
            </p>
          </div>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-secondary"
            >
              <FileText className="w-5 h-5 text-trust-teal flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {progress >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-trust-green flex-shrink-0" />
              ) : (
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}

          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Uploading & scoring... {Math.min(progress, 100)}%
              </p>
            </motion.div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || !walletAddress}
              className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2"
            >
              Analyze & Store on Blockchain
            </Button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default UploadStatement;
