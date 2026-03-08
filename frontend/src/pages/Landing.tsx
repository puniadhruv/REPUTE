import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, BarChart3, Wallet, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Behavior-Based Scoring",
    description: "Build your credit identity through rent, utilities, and income patterns — not traditional credit history.",
  },
  {
    icon: Shield,
    title: "Blockchain Verified",
    description: "Your credit proof is stored on-chain, tamper-proof, and always accessible to lenders you authorize.",
  },
  {
    icon: Wallet,
    title: "Decentralized Identity",
    description: "Own your financial identity. No central authority controls your score — you do.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg trust-gradient-bg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">REPUTE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-trust-teal/10 text-trust-teal text-sm font-medium mb-6">
              <Users className="w-3.5 h-3.5" />
              For gig workers, students & freelancers
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Decentralized Credit Identity
              <br />
              <span className="trust-gradient-text">for the Credit-Invisible</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
              No credit history? No problem. REPUTE analyzes your financial behavior — rent payments, utility bills, income patterns — to generate a verifiable credit score on the blockchain. your financial behavior — rent payments, utility bills, income patterns — to generate a verifiable credit score on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="trust-gradient-bg border-0 text-primary-foreground hover:opacity-90 gap-2 px-8">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Score illustration */}
          <motion.div
            className="mt-16 lg:mt-24 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="trust-card max-w-xl mx-auto p-8 trust-glow">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">Your Behavioral Score</p>
                  <p className="text-5xl font-display font-bold trust-gradient-text mt-1">78</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-trust-teal/15 text-trust-teal font-display font-semibold">
                  Tier B
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Rent Reliability", value: 85, color: "bg-trust-green" },
                  { label: "Utility Payments", value: 72, color: "bg-trust-teal" },
                  { label: "Income Presence", value: 90, color: "bg-trust-purple" },
                  { label: "Fraud-Free", value: 65, color: "bg-trust-amber" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            How REPUTE Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="trust-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-12 h-12 rounded-xl trust-gradient-bg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 text-center text-sm text-muted-foreground">
        <p><p>© 2026 REPUTE. Decentralized Credit Identity Platform.</p>. Decentralized Credit Identity Platform.</p>
      </footer>
    </div>
  );
};

export default Landing;
