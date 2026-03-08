import { motion } from "framer-motion";

interface ScoreBreakdownBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  delay?: number;
}

const ScoreBreakdownBar = ({ label, value, maxValue = 100, color, delay = 0 }: ScoreBreakdownBarProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-muted-foreground">{value}/{maxValue}</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ScoreBreakdownBar;
