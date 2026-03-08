/**
 * ReputeContext — shared wallet address and last score result.
 * Used by UploadStatement, Dashboard, ScoreResult, and BlockchainIdentity.
 */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ScoreResponse } from "@/lib/reputeApi";

interface ReputeContextValue {
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  lastScoreResult: ScoreResponse | null;
  setLastScoreResult: (result: ScoreResponse | null) => void;
}

const ReputeContext = createContext<ReputeContextValue | null>(null);

export function ReputeProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastScoreResult, setLastScoreResult] = useState<ScoreResponse | null>(
    null
  );

  const connectWallet = useCallback(async () => {
    const win = window as Window & {
      ethereum?: { request: (args: { method: string }) => Promise<string[]> };
    };

    if (!win.ethereum) {
      console.warn(
        "MetaMask not detected. Using a demo wallet address for local testing."
      );
      // Fallback demo wallet so the rest of the flow can be tested locally.
      setWalletAddress("0xDEMO000000000000000000000000000000000000");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await win.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts?.[0] ?? null;
      setWalletAddress(account);
    } catch (e) {
      console.error(e);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const value: ReputeContextValue = {
    walletAddress,
    isConnecting,
    connectWallet,
    lastScoreResult,
    setLastScoreResult,
  };

  return (
    <ReputeContext.Provider value={value}>{children}</ReputeContext.Provider>
  );
}

export function useRepute() {
  const ctx = useContext(ReputeContext);
  if (!ctx) throw new Error("useRepute must be used within ReputeProvider");
  return ctx;
}
