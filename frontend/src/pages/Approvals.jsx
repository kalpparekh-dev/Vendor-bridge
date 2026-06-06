import { useEffect, useState } from "react";
import API from "../services/api";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
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
    await API.post("/approvals", form);
    setForm({ quotation_id: "", manager_id: 1, status: "Approved", remarks: "" });
    fetchApprovals();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Approval Workflow</h1>

      <form onSubmit={submitApproval} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input name="quotation_id" placeholder="Quotation ID" value={form.quotation_id} onChange={handleChange} className="input" />
        <select name="status" value={form.status} onChange={handleChange} className="input bg-[#111827]">
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <textarea name="remarks" placeholder="Approval Remarks" value={form.remarks} onChange={handleChange} className="input md:col-span-2" />
        <button className="bg-cyan-400 text-black font-semibold rounded-xl px-4 py-3">Submit Approval</button>
      </form>

      <div className="grid gap-4">
        {approvals.map((a) => (
          <div key={a.id} className="bg-white/10 rounded-2xl p-5">
            <h2 className="font-bold">{a.vendor_name}</h2>
            <p>Quotation ID: {a.quotation_id}</p>
            <p>Price: ₹{a.price}</p>
            <p>Status: <span className={a.status === "Approved" ? "text-green-300" : "text-red-300"}>{a.status}</span></p>
            <p>Remarks: {a.remarks}</p>
          </div>
        ))}
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default Approvals;