import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaTruck,
  FaStar,
  FaRupeeSign,
  FaCheckCircle,
  FaShoppingCart,
} from "react-icons/fa";

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [compareRfqId, setCompareRfqId] = useState(1);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    rfq_id: "",
    vendor_id: "",
    price: "",
    delivery_days: "",
    notes: "",
  });

  useEffect(() => {
    fetchQuotations();
  }, []);

  async function fetchQuotations() {
    const res = await API.get("/quotations");
    setQuotations(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitQuotation(e) {
    e.preventDefault();
    setMessage("");

    await API.post("/quotations", form);

    setForm({
      rfq_id: "",
      vendor_id: "",
      price: "",
      delivery_days: "",
      notes: "",
    });

    setMessage("Quotation submitted successfully");
    fetchQuotations();
  }

  async function compare() {
    setMessage("");
    try {
      const res = await API.get(`/quotations/compare/${compareRfqId}`);
      setComparison(res.data);
    } catch {
      setComparison(null);
      setMessage("No quotations found for this RFQ");
    }
  }

  async function approveQuotation(quotationId) {
    await API.post("/approvals", {
      quotation_id: quotationId,
      manager_id: 1,
      status: "Approved",
      remarks: "Approved from quotation comparison screen",
    });

    setMessage("Quotation approved successfully");
    fetchQuotations();
    compare();
  }

  async function generatePO(quotationId) {
    try {
      const res = await API.post("/purchase-orders", {
        quotation_id: quotationId,
        user_id: 1,
      });

      setMessage(`Purchase Order generated: ${res.data.po_number}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "PO generation failed");
    }
  }

  function isBestPrice(q) {
    return comparison?.best_price?.quotation_id === q.quotation_id;
  }

  function isFastest(q) {
    return comparison?.fastest_delivery?.quotation_id === q.quotation_id;
  }

  function isRecommended(q) {
    return comparison?.recommended?.quotation_id === q.quotation_id;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-blue-500/20 border border-white/10 p-8"
      >
        <h1 className="text-4xl font-bold">Quotation Comparison Engine</h1>
        <p className="text-gray-300 mt-3">
          Compare vendor pricing, delivery timelines and rating to select the best procurement option.
        </p>
      </motion.div>

      {message && (
        <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-5 py-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={submitQuotation}
          className="xl:col-span-1 bg-white/10 border border-white/10 rounded-3xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold">Submit Quotation</h2>

          <input
            name="rfq_id"
            placeholder="RFQ ID"
            value={form.rfq_id}
            onChange={handleChange}
            className="input"
          />

          <input
            name="vendor_id"
            placeholder="Vendor ID"
            value={form.vendor_id}
            onChange={handleChange}
            className="input"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input"
          />

          <input
            name="delivery_days"
            type="number"
            placeholder="Delivery Days"
            value={form.delivery_days}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="notes"
            placeholder="Vendor Notes"
            value={form.notes}
            onChange={handleChange}
            className="input min-h-28"
          />

          <button className="w-full bg-cyan-400 text-black font-semibold py-3 rounded-xl hover:bg-cyan-300">
            Submit Quotation
          </button>
        </form>

        <div className="xl:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Compare RFQ Quotations</h2>

          <div className="flex gap-4">
            <input
              value={compareRfqId}
              onChange={(e) => setCompareRfqId(e.target.value)}
              placeholder="Enter RFQ ID"
              className="input"
            />

            <button
              onClick={compare}
              className="bg-purple-500 px-6 rounded-xl font-semibold hover:bg-purple-400"
            >
              Compare
            </button>
          </div>

          {comparison && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-500/20 border border-green-400/20 p-5 rounded-2xl">
                <FaRupeeSign className="text-green-300 text-2xl mb-3" />
                <h3 className="text-green-300 font-bold">Best Price</h3>
                <p className="text-xl font-bold mt-2">
                  {comparison.best_price.vendor_name}
                </p>
                <p>₹{comparison.best_price.price}</p>
              </div>

              <div className="bg-cyan-500/20 border border-cyan-400/20 p-5 rounded-2xl">
                <FaTruck className="text-cyan-300 text-2xl mb-3" />
                <h3 className="text-cyan-300 font-bold">Fastest Delivery</h3>
                <p className="text-xl font-bold mt-2">
                  {comparison.fastest_delivery.vendor_name}
                </p>
                <p>{comparison.fastest_delivery.delivery_days} days</p>
              </div>

              <div className="bg-purple-500/20 border border-purple-400/20 p-5 rounded-2xl">
                <FaTrophy className="text-purple-300 text-2xl mb-3" />
                <h3 className="text-purple-300 font-bold">Recommended</h3>
                <p className="text-xl font-bold mt-2">
                  {comparison.recommended.vendor_name}
                </p>
                <p>₹{comparison.recommended.price}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {comparison && (
        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">Side-by-Side Vendor Comparison</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {comparison.quotations.map((q) => (
              <motion.div
                key={q.quotation_id}
                whileHover={{ scale: 1.03, y: -6 }}
                className={`relative rounded-3xl p-6 border ${
                  isRecommended(q)
                    ? "bg-purple-500/20 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.35)]"
                    : "bg-white/10 border-white/10"
                }`}
              >
                {isRecommended(q) && (
                  <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                <h3 className="text-2xl font-bold">{q.vendor_name}</h3>

                <div className="flex items-center gap-2 mt-2 text-yellow-300">
                  <FaStar />
                  <span>{q.rating} / 5 Rating</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-black/20 rounded-2xl p-4">
                    <p className="text-gray-400">Quoted Price</p>
                    <h4 className="text-3xl font-bold">₹{q.price}</h4>
                    {isBestPrice(q) && (
                      <span className="inline-block mt-2 text-green-300 text-sm">
                        <FaTrophy className="inline mr-1" />
                        Best Price
                      </span>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-2xl p-4">
                    <p className="text-gray-400">Delivery Timeline</p>
                    <h4 className="text-3xl font-bold">{q.delivery_days} days</h4>
                    {isFastest(q) && (
                      <span className="inline-block mt-2 text-cyan-300 text-sm">
                        <FaTruck className="inline mr-1" />
                        Fastest Delivery
                      </span>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-2xl p-4">
                    <p className="text-gray-400">Notes</p>
                    <p>{q.notes || "No notes provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => approveQuotation(q.quotation_id)}
                    className="bg-green-500/20 text-green-300 py-3 rounded-xl hover:bg-green-500/30"
                  >
                    <FaCheckCircle className="inline mr-2" />
                    Approve
                  </button>

                  <button
                    onClick={() => generatePO(q.quotation_id)}
                    className="bg-cyan-400 text-black py-3 rounded-xl font-semibold hover:bg-cyan-300"
                  >
                    <FaShoppingCart className="inline mr-2" />
                    PO
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">All Quotations</h2>
        </div>

        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th>RFQ</th>
              <th>Vendor</th>
              <th>Rating</th>
              <th>Price</th>
              <th>Delivery</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {quotations.map((q) => (
              <tr key={q.id} className="border-t border-white/10 text-center">
                <td className="p-4 text-left">{q.id}</td>
                <td>{q.rfq_id}</td>
                <td>{q.vendor_name}</td>
                <td>⭐ {q.rating}</td>
                <td>₹{q.price}</td>
                <td>{q.delivery_days} days</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      q.status === "Approved"
                        ? "bg-green-500/20 text-green-300"
                        : q.status === "Rejected"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Quotations;