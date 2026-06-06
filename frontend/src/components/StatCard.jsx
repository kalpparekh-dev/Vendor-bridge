import { motion } from "framer-motion";

function StatCard({ title, value, subtitle, icon, trend, color = "cyan" }) {
  const colors = {
    cyan: "from-cyan-500/20 to-blue-500/10 text-cyan-300",
    green: "from-green-500/20 to-emerald-500/10 text-green-300",
    purple: "from-purple-500/20 to-indigo-500/10 text-purple-300",
    orange: "from-orange-500/20 to-yellow-500/10 text-orange-300",
    red: "from-red-500/20 to-pink-500/10 text-red-300",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -6 }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colors[color]} border border-white/10 rounded-3xl p-6 shadow-xl`}
    >
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <h3 className="text-4xl font-bold mt-3 text-white">{value}</h3>
        </div>

        <div className="text-3xl bg-white/10 p-4 rounded-2xl">
          {icon}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm">{subtitle}</p>
        {trend && (
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;