import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaFileInvoice,
  FaShoppingCart,
  FaUserTie,
  FaClock,
} from "react-icons/fa";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    quotation_id: "",
    manager_id: 1,
    status: "Approved",
    remarks: "",
  });

  useEffect(() => {
    fetchApprovals();
  }, []);

  async function fetchApprovals() {
    const res = await API.get("/approvals");
    setApprovals(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitApproval(e) {
    e.preventDefault();
    setMessage("");

    await API.post("/approvals", form);

    setMessage(`Quotation ${form.status} successfully`);

    setForm({
      quotation_id: "",
      manager_id: 1,
      status: "Approved",
      remarks: "",
    });

    fetchApprovals();
  }

  const approvedCount = approvals.filter((a) => a.status === "Approved").length;
  const rejectedCount = approvals.filter((a) => a.status === "Rejected").length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-green-500/20 via-cyan-500/10 to-purple-500/20 border border-white/10 p-8"
      >
        <h1 className="text-4xl font-bold">Approval Workflow</h1>
        <p className="text-gray-300 mt-3">
          Review vendor quotations, approve procurement requests and move them towards purchase order generation.
        </p>
      </motion.div>

      {message && (
        <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-5 py-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Decisions"
          value={approvals.length}
          icon={<FaClipboardList />}
          color="cyan"
        />
        <SummaryCard
          title="Approved"
          value={approvedCount}
          icon={<FaCheckCircle />}
          color="green"
        />
        <SummaryCard
          title="Rejected"
          value={rejectedCount}
          icon={<FaTimesCircle />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={submitApproval}
          className="xl:col-span-1 bg-white/10 border border-white/10 rounded-3xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold">Manager Decision</h2>

          <input
            name="quotation_id"
            placeholder="Quotation ID"
            value={form.quotation_id}
            onChange={handleChange}
            className="input"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input bg-[#111827]"
          >
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <textarea
            name="remarks"
            placeholder="Approval Remarks"
            value={form.remarks}
            onChange={handleChange}
            className="input min-h-32"
          />

          <button
            className={`w-full font-semibold py-3 rounded-xl ${
              form.status === "Approved"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {form.status === "Approved" ? "Approve Quotation" : "Reject Quotation"}
          </button>
        </form>

        <div className="xl:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">ERP Workflow Timeline</h2>

          <div className="space-y-6">
            <TimelineStep
              icon={<FaClipboardList />}
              title="RFQ Created"
              subtitle="Procurement officer creates request for quotation"
              active
            />
            <TimelineStep
              icon={<FaFileInvoice />}
              title="Quotation Submitted"
              subtitle="Vendors submit pricing and delivery timelines"
              active
            />
            <TimelineStep
              icon={<FaUserTie />}
              title="Manager Approval"
              subtitle="Manager approves or rejects selected quotation"
              active={approvals.length > 0}
            />
            <TimelineStep
              icon={<FaShoppingCart />}
              title="Purchase Order"
              subtitle="Approved quotation can generate purchase order"
              active={approvedCount > 0}
            />
            <TimelineStep
              icon={<FaCheckCircle />}
              title="Invoice"
              subtitle="Invoice is generated from purchase order"
              active={approvedCount > 0}
            />
          </div>
        </div>
      </div>

      <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-6">Approval History</h2>

        <div className="grid gap-5">
          {approvals.length === 0 && (
            <p className="text-gray-400">No approvals yet.</p>
          )}

          {approvals.map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <h3 className="text-xl font-bold">{a.vendor_name}</h3>
                  <p className="text-gray-400">
                    RFQ #{a.rfq_id} • Quotation #{a.quotation_id}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    a.status === "Approved"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <Info label="Vendor" value={a.vendor_name} />
                <Info label="Price" value={`₹${a.price}`} />
                <Info label="Delivery" value={`${a.delivery_days} days`} />
                <Info label="Manager ID" value={a.manager_id} />
              </div>

              <div className="bg-black/20 rounded-2xl p-4 mt-5">
                <p className="text-gray-400">Remarks</p>
                <p>{a.remarks || "No remarks added"}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                <FaClock />
                <span>{a.approved_at}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          padding: 13px 16px;
          outline: none;
          color: white;
        }
        .input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const styles = {
    cyan: "from-cyan-500/20 to-blue-500/10 text-cyan-300",
    green: "from-green-500/20 to-emerald-500/10 text-green-300",
    red: "from-red-500/20 to-pink-500/10 text-red-300",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -5 }}
      className={`bg-gradient-to-br ${styles[color]} border border-white/10 rounded-3xl p-6`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <p className="text-gray-300">{title}</p>
      <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
    </motion.div>
  );
}

function TimelineStep({ icon, title, subtitle, active }) {
  return (
    <div className="flex gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          active
            ? "bg-cyan-400/20 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
            : "bg-white/10 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className={active ? "font-bold text-white" : "font-bold text-gray-500"}>
          {title}
        </h3>
        <p className="text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}

export default Approvals;