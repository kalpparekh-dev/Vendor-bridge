import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClipboardList,
  FaFileInvoice,
  FaCheckCircle,
} from "react-icons/fa";

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0a0f2e] to-[#091321] text-white overflow-hidden">
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold">
          Vendor<span className="text-cyan-400">Bridge</span>
        </h1>

        <div className="flex gap-4">
          <Link to="/login" className="bg-white/10 px-5 py-3 rounded-xl">
            Login
          </Link>
          <Link to="/signup" className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-semibold">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="px-10 pt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-6xl font-bold leading-tight">
            Smart Procurement ERP for Modern Organizations
          </h2>

          <p className="text-gray-300 text-xl mt-6 max-w-2xl">
            Manage vendors, RFQs, quotations, approvals, purchase orders and invoices from one powerful ERP platform.
          </p>

          <div className="flex gap-5 mt-8">
            <Link to="/signup" className="bg-cyan-400 text-black px-7 py-4 rounded-xl font-semibold">
              Start Now
            </Link>
            <Link to="/login" className="bg-white/10 border border-white/10 px-7 py-4 rounded-xl">
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

          <div className="relative bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Procurement Workflow</h3>

            <div className="space-y-5">
              <Step icon={<FaClipboardList />} title="Create RFQ" />
              <Step icon={<FaUsers />} title="Receive Vendor Quotations" />
              <Step icon={<FaCheckCircle />} title="Manager Approval" />
              <Step icon={<FaFileInvoice />} title="Generate Invoice" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-10 mt-24 pb-20">
        <Feature icon={<FaUsers />} title="Vendor Management" />
        <Feature icon={<FaClipboardList />} title="RFQ Automation" />
        <Feature icon={<FaCheckCircle />} title="Approval Workflow" />
        <Feature icon={<FaFileInvoice />} title="Invoice Generation" />
      </section>
    </div>
  );
}

function Step({ icon, title }) {
  return (
    <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
      <div className="text-cyan-300 text-2xl">{icon}</div>
      <p className="font-semibold">{title}</p>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-white/10 border border-white/10 rounded-3xl p-6">
      <div className="text-cyan-300 text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
    </motion.div>
  );
}

export default Landing;