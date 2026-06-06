import { motion } from "framer-motion";

function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
      <p className="text-cyan-300 text-sm mt-2">{subtitle}</p>
    </motion.div>
  );
}

export default StatCard;