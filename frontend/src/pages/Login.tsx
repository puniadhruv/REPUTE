import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, CreditCard, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep("otp");
  };

  const handleVerify = () => {
    if (otp.length === 6) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 trust-gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl">REPUTE</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Build your credit identity with everyday transactions
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Join thousands of freelancers, gig workers, and students who are building verifiable credit scores through their financial behavior.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {step === "phone" ? "Welcome to REPUTE" : "Verify your number"}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {step === "phone"
              ? "Enter your phone number to get started"
              : `We sent a 6-digit code to ${phone}`}
          </p>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button
                  onClick={handleSendOtp}
                  className="w-full h-12 trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2"
                  disabled={phone.length < 10}
                >
                  Send OTP <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={handleVerify}
                  className="w-full h-12 trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2"
                  disabled={otp.length < 6}
                >
                  Verify & Continue <ArrowRight className="w-4 h-4" />
                </Button>
                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change phone number
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
