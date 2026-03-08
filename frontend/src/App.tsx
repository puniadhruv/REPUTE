import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReputeProvider } from "@/context/ReputeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadStatement from "./pages/UploadStatement";
import Insights from "./pages/Insights";
import ScoreResult from "./pages/ScoreResult";
import BlockchainIdentity from "./pages/BlockchainIdentity";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ReputeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadStatement />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/score" element={<ScoreResult />} />
          <Route path="/blockchain" element={<BlockchainIdentity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ReputeProvider>
  </QueryClientProvider>
);

export default App;
