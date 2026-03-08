import { motion } from "framer-motion";

interface CreditScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  tier: string;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "A":
    case "Excellent":
      return "hsl(152, 60%, 50%)";
    case "B":
    case "Good":
      return "hsl(174, 62%, 47%)";
    case "C":
    case "Average":
      return "hsl(38, 92%, 50%)";
    case "D":
    case "Risky":
    default:
      return "hsl(0, 72%, 51%)";
  }
};

const CreditScoreRing = ({ score, maxScore = 100, size = 200, tier }: CreditScoreRingProps) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const offset = circumference - progress;
  const color = getTierColor(tier);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-display font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-muted-foreground">out of {maxScore}</span>
      </div>
    </div>
  );
};

export default CreditScoreRing;
