import { useEffect, useState } from "react";
import API from "../services/api";
import StatCard from "../components/StatCard";
import {
  FaUsers,
  FaClipboardList,
  FaFileInvoice,
  FaCheckCircle,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/dashboard").then((res) => setStats(res.data));
    API.get("/activities").then((res) => setLogs(res.data.slice(0, 5)));
  }, []);

  if (!stats) return <p className="text-white">Loading dashboard...</p>;

  const spendData = [
    { month: "Jan", spend: 45000 },
    { month: "Feb", spend: 62000 },
    { month: "Mar", spend: 38000 },
    { month: "Apr", spend: 90000 },
    { month: "May", spend: 74000 },
    { month: "Jun", spend: Number(stats.total_spend) || 59000 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Furniture", value: 25 },
    { name: "Logistics", value: 20 },
    { name: "Office", value: 20 },
  ];

  const COLORS = ["#06b6d4", "#8b5cf6", "#22c55e", "#f59e0b"];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 p-8"
      >
        <div className="absolute right-10 top-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

        <h1 className="text-4xl font-bold">Welcome back, Procurement Officer 👋</h1>
        <p className="text-gray-300 mt-3 max-w-2xl">
          Track RFQs, vendors, approvals, purchase orders and invoices from one live procurement command center.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/rfqs")}
            className="bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl hover:bg-cyan-300"
          >
            + Create RFQ
          </button>
          <button
            onClick={() => navigate("/vendors")}
            className="bg-white/10 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/20"
          >
            + Add Vendor
          </button>
          <button
            onClick={() => navigate("/purchase-orders")}
            className="bg-purple-500/30 border border-purple-400/20 px-5 py-3 rounded-xl hover:bg-purple-500/40"
          >
            Generate PO
          </button>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Vendors" value={stats.total_vendors} subtitle="Registered vendors" trend="+12%" icon={<FaUsers />} color="cyan" />
        <StatCard title="Active RFQs" value={stats.active_rfqs} subtitle="Currently open" trend="Live" icon={<FaClipboardList />} color="purple" />
        <StatCard title="Pending Approvals" value={stats.total_quotations - stats.approved_quotations} subtitle="Manager action needed" trend="Review" icon={<FaCheckCircle />} color="orange" />
        <StatCard title="Total Spend" value={`₹${stats.total_spend}`} subtitle="Invoice value" trend="+18%" icon={<FaRupeeSign />} color="green" />
        <StatCard title="Quotations" value={stats.total_quotations} subtitle="Vendor responses" icon={<FaFileInvoice />} color="cyan" />
        <StatCard title="Purchase Orders" value={stats.total_purchase_orders} subtitle="Generated POs" icon={<FaShoppingCart />} color="purple" />
        <StatCard title="Invoices" value={stats.total_invoices} subtitle="Generated invoices" icon={<FaFileInvoice />} color="green" />
        <StatCard title="Approved" value={stats.approved_quotations} subtitle="Manager approved" icon={<FaCheckCircle />} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-1">Procurement Spending Trend</h2>
          <p className="text-gray-400 mb-6">Monthly purchase and invoice value</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="#06b6d4"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-1">Vendor Categories</h2>
          <p className="text-gray-400 mb-6">Procurement distribution</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={105} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">RFQ Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "RFQs", value: stats.total_rfqs },
                { name: "Quotes", value: stats.total_quotations },
                { name: "POs", value: stats.total_purchase_orders },
                { name: "Invoices", value: stats.total_invoices },
              ]}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Procurement Activity</h2>

          <div className="space-y-5">
            {logs.length === 0 && (
              <p className="text-gray-400">No activities yet.</p>
            )}

            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 shadow-[0_0_20px_#06b6d4]"></div>
                <div className="border-b border-white/10 pb-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{log.module}</h3>
                    <span className="text-xs text-gray-400">{log.created_at}</span>
                  </div>
                  <p className="text-gray-300">{log.description}</p>
                  <span className="text-xs text-cyan-300">{log.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;