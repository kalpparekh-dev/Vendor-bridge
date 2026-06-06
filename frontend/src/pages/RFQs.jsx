import { useEffect, useState } from "react";
import API from "../services/api";

function RFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    deadline: "",
    created_by: 1,
  });

  useEffect(() => {
    fetchRfqs();
  }, []);

  async function fetchRfqs() {
    const res = await API.get("/rfqs");
    setRfqs(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createRfq(e) {
    e.preventDefault();
    await API.post("/rfqs", form);
    setForm({ title: "", description: "", quantity: "", deadline: "", created_by: 1 });
    fetchRfqs();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">RFQ Management</h1>

      <form onSubmit={createRfq} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input name="title" placeholder="RFQ Title" value={form.title} onChange={handleChange} className="input" />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="input" />
        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input md:col-span-2" />
        <button className="bg-cyan-400 text-black font-semibold rounded-xl px-4 py-3">Create RFQ</button>
      </form>

      <div className="grid gap-4">
        {rfqs.map((r) => (
          <div key={r.id} className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{r.title}</h2>
              <span className="text-cyan-300">{r.status}</span>
            </div>
            <p className="text-gray-300 mt-2">{r.description}</p>
            <p className="mt-2">Quantity: {r.quantity}</p>
            <p>Deadline: {r.deadline}</p>
          </div>
        ))}
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default RFQs;