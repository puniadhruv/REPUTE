const tierConfig: Record<string, { bg: string; text: string; label: string }> = {
  A: { bg: "bg-trust-green/15", text: "text-trust-green", label: "Excellent" },
  B: { bg: "bg-trust-teal/15", text: "text-trust-teal", label: "Good" },
  C: { bg: "bg-trust-amber/15", text: "text-trust-amber", label: "Fair" },
  D: { bg: "bg-trust-red/15", text: "text-trust-red", label: "Needs Work" },
  // Backend tiers (from scoring engine)
  Excellent: { bg: "bg-trust-green/15", text: "text-trust-green", label: "Excellent" },
  Good: { bg: "bg-trust-teal/15", text: "text-trust-teal", label: "Good" },
  Average: { bg: "bg-trust-amber/15", text: "text-trust-amber", label: "Average" },
  Risky: { bg: "bg-trust-red/15", text: "text-trust-red", label: "Risky" },
};

const TierBadge = ({ tier, size = "md" }: { tier: string; size?: "sm" | "md" | "lg" }) => {
  const config = tierConfig[tier] || tierConfig.D;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold font-display ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      {["A", "B", "C", "D"].includes(tier) ? `Tier ${tier}` : config.label}
      <span className="font-body font-normal opacity-80">· {config.label}</span>
    </span>
  );
};

export default TierBadge;
