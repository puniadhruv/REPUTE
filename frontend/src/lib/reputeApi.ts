/**
 * REPUTE Backend API client.
 * Connects the frontend to the Node.js backend at http://localhost:5000.
 */
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/** Backend tier: Excellent | Good | Average | Risky. UI uses A/B/C/D. */
export const tierToLetter: Record<string, string> = {
  Excellent: "A",
  Good: "B",
  Average: "C",
  Risky: "D",
};

export interface UploadResponse {
  message: string;
  filePath: string;
}

export interface ScoreResponse {
  score: number;
  tier: string;
  proofHash: string;
  message: string;
}

export interface ReputationResponse {
  wallet: string;
  tier: string;
  proofHash: string;
  timestamp: number;
}

/** POST /api/upload — upload CSV file; returns filePath. */
export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<UploadResponse>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** POST /api/score — run scoring engine and store on blockchain. */
export async function submitScore(
  wallet: string,
  filePath: string
): Promise<ScoreResponse> {
  const { data } = await api.post<ScoreResponse>("/score", { wallet, filePath });
  return data;
}

/** GET /api/reputation/:wallet — fetch on-chain reputation. */
export async function getReputation(
  wallet: string
): Promise<ReputationResponse> {
  const { data } = await api.get<ReputationResponse>(`/reputation/${wallet}`);
  return data;
}
