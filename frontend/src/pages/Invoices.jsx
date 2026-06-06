import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  FaFileInvoice,
  FaPrint,
  FaEnvelope,
  FaDownload,
  FaRupeeSign,
} from "react-icons/fa";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [poId, setPoId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const res = await API.get("/invoices");
    setInvoices(res.data);
  }

  async function generateInvoice(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/invoices", {
        po_id: poId,
        user_id: 1,
      });

      setMessage(`Invoice generated: ${res.data.invoice_number}`);
      setPoId("");
      fetchInvoices();
    } catch (err) {
      setMessage(err.response?.data?.error || "Invoice generation failed");
    }
  }

  function downloadPDF(invoice) {
    window.open(`http://127.0.0.1:5000/api/invoices/${invoice.id}/pdf`, "_blank");
  }

  async function emailInvoice(invoice) {
    const toEmail = prompt("Enter receiver email:", invoice.vendor_email || "");

    if (!toEmail) return;

    const res = await API.post(`/invoices/${invoice.id}/email`, {
      to_email: toEmail,
    });

    setMessage(res.data.message);
  }

  function printInvoice(invoice) {
    window.open(`http://127.0.0.1:5000/api/invoices/${invoice.id}/pdf`, "_blank");
  }

  const totalInvoiceValue = invoices.reduce(
    (sum, inv) => sum + Number(inv.grand_total || 0),
    0
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 p-8"
      >
        <h1 className="text-4xl font-bold">Invoice Management</h1>
        <p className="text-gray-300 mt-3">
          Generate, print, download PDF and email procurement invoices.
        </p>
      </motion.div>

      {message && (
        <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-5 py-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Summary title="Total Invoices" value={invoices.length} icon={<FaFileInvoice />} />
        <Summary title="Invoice Value" value={`₹${totalInvoiceValue}`} icon={<FaRupeeSign />} />
        <Summary title="PDF Enabled" value="Yes" icon={<FaFileInvoice />} />
      </div>

      <form
        onSubmit={generateInvoice}
        className="bg-white/10 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-4"
      >
        <input
          value={poId}
          onChange={(e) => setPoId(e.target.value)}
          placeholder="Enter Purchase Order ID"
          className="input"
        />

        <button className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-cyan-300">
          Generate Invoice
        </button>
      </form>

      <div className="grid gap-6">
        {invoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex flex-col xl:flex-row xl:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold">{invoice.invoice_number}</h2>
                <p className="text-gray-400 mt-1">PO: {invoice.po_number}</p>
                <p className="text-gray-400">Vendor: {invoice.vendor_name}</p>
                <p className="text-gray-400">Email: {invoice.vendor_email}</p>
                <p className="text-gray-400">Created: {invoice.created_at}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[520px]">
                <Info label="Amount" value={`₹${invoice.amount}`} />
                <Info label="GST 18%" value={`₹${invoice.tax}`} />
                <Info label="Grand Total" value={`₹${invoice.grand_total}`} highlight />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <button onClick={() => printInvoice(invoice)} className="btn purple">
                <FaPrint className="inline mr-2" />
                Print
              </button>

              <button onClick={() => downloadPDF(invoice)} className="btn green">
                <FaDownload className="inline mr-2" />
                PDF
              </button>

              <button onClick={() => emailInvoice(invoice)} className="bg-cyan-400 text-black px-5 py-3 rounded-xl font-semibold hover:bg-cyan-300">
                <FaEnvelope className="inline mr-2" />
                Email
              </button>
            </div>
          </motion.div>
        ))}
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
        .btn {
          padding: 12px 20px;
          border-radius: 12px;
        }
        .purple {
          background: rgba(168,85,247,.2);
          color: #d8b4fe;
        }
        .green {
          background: rgba(34,197,94,.2);
          color: #86efac;
        }
      `}</style>
    </div>
  );
}

function Summary({ title, value, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.04, y: -5 }} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-white/10 rounded-3xl p-6">
      <div className="text-3xl text-cyan-300 mb-4">{icon}</div>
      <p className="text-gray-300">{title}</p>
      <h3 className="text-4xl font-bold text-white mt-2">{value}</h3>
    </motion.div>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`font-bold mt-1 ${highlight ? "text-cyan-300 text-xl" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default Invoices;