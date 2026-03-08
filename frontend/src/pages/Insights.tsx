import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Repeat, DollarSign, AlertTriangle } from "lucide-react";

const monthlyIncome = [
  { month: "Oct", amount: 3200 },
  { month: "Nov", amount: 2800 },
  { month: "Dec", amount: 3600 },
  { month: "Jan", amount: 3100 },
  { month: "Feb", amount: 3400 },
  { month: "Mar", amount: 3900 },
];

const categories = [
  { name: "Rent", value: 1200, color: "hsl(152, 60%, 50%)" },
  { name: "Utilities", value: 340, color: "hsl(174, 62%, 47%)" },
  { name: "Income", value: 3900, color: "hsl(262, 52%, 47%)" },
  { name: "Other", value: 860, color: "hsl(38, 92%, 50%)" },
];

const recurringPayments = [
  { name: "Apartment Rent", amount: "$1,200", frequency: "Monthly", status: "On-time" },
  { name: "Electric Bill", amount: "$85", frequency: "Monthly", status: "On-time" },
  { name: "Internet Service", amount: "$60", frequency: "Monthly", status: "On-time" },
  { name: "Water Bill", amount: "$45", frequency: "Monthly", status: "Late (1x)" },
  { name: "Phone Bill", amount: "$55", frequency: "Monthly", status: "On-time" },
];

const insights = [
  { icon: TrendingUp, title: "Strong Income Growth", desc: "Your income increased 22% over the last 6 months.", type: "positive" as const },
  { icon: Repeat, title: "Consistent Rent Payments", desc: "100% on-time rent payments detected across all months.", type: "positive" as const },
  { icon: DollarSign, title: "Healthy Savings Ratio", desc: "You save approximately 18% of your monthly income.", type: "positive" as const },
  { icon: AlertTriangle, title: "One Late Utility Payment", desc: "Water bill was late once in January — minor impact on score.", type: "warning" as const },
];

const Insights = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Transaction Insights</h1>
        <p className="text-muted-foreground text-sm mb-8">Financial patterns detected from your bank statement</p>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="trust-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Monthly Income</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 15%, 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(174, 62%, 47%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="trust-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Transaction Categories</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 15%, 90%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recurring Payments Table */}
        <div className="trust-card mb-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Recurring Payments Detected</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Frequency</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recurringPayments.map((p) => (
                  <tr key={p.name} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 px-4 text-foreground">{p.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.frequency}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === "On-time"
                          ? "bg-trust-green/15 text-trust-green"
                          : "bg-trust-amber/15 text-trust-amber"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Behavioral Insights */}
        <div className="trust-card">
          <h2 className="font-display font-semibold text-foreground mb-4">Financial Behavior Insights</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {insights.map((item) => (
              <div
                key={item.title}
                className={`p-4 rounded-lg border ${
                  item.type === "positive" ? "border-trust-green/20 bg-trust-green/5" : "border-trust-amber/20 bg-trust-amber/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`w-4 h-4 ${item.type === "positive" ? "text-trust-green" : "text-trust-amber"}`} />
                  <span className="font-medium text-sm text-foreground">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Insights;
