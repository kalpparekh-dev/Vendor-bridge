import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaInfoCircle,
  FaUsers,
  FaPaperclip,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

function RFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    deadline: "",
    created_by: 1,
    selected_vendors: [],
    attachment_name: "",
  });

  useEffect(() => {
    fetchRfqs();
    fetchVendors();
  }, []);

  async function fetchRfqs() {
    const res = await API.get("/rfqs");
    setRfqs(res.data);
  }

  async function fetchVendors() {
    const res = await API.get("/vendors");
    setVendors(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleVendor(id) {
    const exists = form.selected_vendors.includes(id);

    setForm({
      ...form,
      selected_vendors: exists
        ? form.selected_vendors.filter((v) => v !== id)
        : [...form.selected_vendors, id],
    });
  }

  function nextStep() {
    if (step < 4) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function createRfq() {
    setMessage("");

    await API.post("/rfqs", {
      title: form.title,
      description: form.description,
      quantity: form.quantity,
      deadline: form.deadline,
      created_by: form.created_by,
    });

    setMessage("RFQ created successfully");

    setForm({
      title: "",
      description: "",
      quantity: "",
      deadline: "",
      created_by: 1,
      selected_vendors: [],
      attachment_name: "",
    });

    setStep(1);
    fetchRfqs();
  }

  const steps = [
    { id: 1, label: "Details", icon: <FaInfoCircle /> },
    { id: 2, label: "Vendors", icon: <FaUsers /> },
    { id: 3, label: "Attachments", icon: <FaPaperclip /> },
    { id: 4, label: "Review", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 p-8"
      >
        <h1 className="text-4xl font-bold">RFQ Creation Workflow</h1>
        <p className="text-gray-300 mt-3">
          Create structured procurement requests with vendor assignment and review flow.
        </p>
      </motion.div>

      {message && (
        <div className="bg-green-400/10 border border-green-400/20 text-green-300 px-5 py-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border ${
                step === s.id
                  ? "bg-cyan-400/20 border-cyan-400 text-cyan-300"
                  : step > s.id
                  ? "bg-green-400/20 border-green-400 text-green-300"
                  : "bg-white/5 border-white/10 text-gray-400"
              }`}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              name="title"
              placeholder="RFQ Title"
              value={form.title}
              onChange={handleChange}
              className="input"
            />

            <input
              name="quantity"
              type="number"
              placeholder="Quantity Required"
              value={form.quantity}
              onChange={handleChange}
              className="input"
            />

            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="input"
            />

            <select className="input bg-[#111827]" name="created_by" value={form.created_by} onChange={handleChange}>
              <option value="1">Procurement Officer</option>
              <option value="2">Admin</option>
            </select>

            <textarea
              name="description"
              placeholder="Product / Service Details"
              value={form.description}
              onChange={handleChange}
              className="input md:col-span-2 min-h-32"
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Assign Vendors</h2>

            {vendors.length === 0 && (
              <p className="text-gray-400">No vendors found. Add vendors first.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => toggleVendor(vendor.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition ${
                    form.selected_vendors.includes(vendor.id)
                      ? "bg-cyan-400/20 border-cyan-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <h3 className="text-xl font-bold">{vendor.vendor_name}</h3>
                  <p className="text-gray-400">{vendor.category}</p>
                  <p className="text-yellow-300 mt-2">⭐ {vendor.rating}</p>
                  <p className="text-sm text-gray-400 mt-2">{vendor.email}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <h2 className="text-2xl font-bold">Attachments</h2>

            <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center bg-white/5">
              <FaPaperclip className="mx-auto text-4xl text-cyan-300 mb-4" />
              <p className="text-gray-300">Upload product specification or procurement document</p>
              <p className="text-sm text-gray-500 mt-2">
                Demo field only. File upload can be integrated later.
              </p>

              <input
                name="attachment_name"
                placeholder="Attachment Name"
                value={form.attachment_name}
                onChange={handleChange}
                className="input mt-6 max-w-md mx-auto"
              />
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <h2 className="text-2xl font-bold">Review RFQ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Review label="Title" value={form.title} />
              <Review label="Quantity" value={form.quantity} />
              <Review label="Deadline" value={form.deadline} />
              <Review label="Attachment" value={form.attachment_name || "No attachment"} />
              <Review label="Selected Vendors" value={form.selected_vendors.length} />
              <Review label="Created By" value={`User ${form.created_by}`} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400">Description</p>
              <p>{form.description}</p>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="bg-white/10 px-5 py-3 rounded-xl disabled:opacity-40"
          >
            <FaArrowLeft className="inline mr-2" />
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl"
            >
              Next
              <FaArrowRight className="inline ml-2" />
            </button>
          ) : (
            <button
              onClick={createRfq}
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl"
            >
              <FaCheckCircle className="inline mr-2" />
              Create RFQ
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardList className="text-cyan-300 text-2xl" />
          <h2 className="text-2xl font-bold">Existing RFQs</h2>
        </div>

        <div className="grid gap-4">
          {rfqs.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-bold">{r.title}</h3>
                  <p className="text-gray-400 mt-1">{r.description}</p>
                </div>

                <span
                  className={`h-fit px-4 py-2 rounded-full text-sm ${
                    r.status === "Open"
                      ? "bg-cyan-400/20 text-cyan-300"
                      : r.status === "PO Generated"
                      ? "bg-green-400/20 text-green-300"
                      : "bg-purple-400/20 text-purple-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                <p>
                  <span className="text-gray-400">Quantity:</span> {r.quantity}
                </p>
                <p>
                  <span className="text-gray-400">Deadline:</span> {r.deadline}
                </p>
                <p>
                  <span className="text-gray-400">Created:</span> {r.created_at}
                </p>
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

function Review({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-gray-400">{label}</p>
      <p className="text-xl font-semibold mt-1">{value || "Not provided"}</p>
    </div>
  );
}

export default RFQs;