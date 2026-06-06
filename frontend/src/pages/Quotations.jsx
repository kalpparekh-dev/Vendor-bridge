import { useEffect, useState } from "react";
import API from "../services/api";

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [compareRfqId, setCompareRfqId] = useState(1);

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
    await API.post("/quotations", form);
    setForm({ rfq_id: "", vendor_id: "", price: "", delivery_days: "", notes: "" });
    fetchQuotations();
  }

  async function compare() {
    const res = await API.get(`/quotations/compare/${compareRfqId}`);
    setComparison(res.data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quotations & Comparison</h1>

      <form onSubmit={submitQuotation} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input name="rfq_id" placeholder="RFQ ID" value={form.rfq_id} onChange={handleChange} className="input" />
        <input name="vendor_id" placeholder="Vendor ID" value={form.vendor_id} onChange={handleChange} className="input" />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input" />
        <input name="delivery_days" type="number" placeholder="Delivery Days" value={form.delivery_days} onChange={handleChange} className="input" />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="input" />
        <button className="bg-cyan-400 text-black font-semibold rounded-xl px-4 py-3">Submit Quotation</button>
      </form>

      <div className="bg-white/10 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Compare Quotations</h2>
        <div className="flex gap-4">
          <input value={compareRfqId} onChange={(e) => setCompareRfqId(e.target.value)} placeholder="RFQ ID" className="input" />
          <button onClick={compare} className="bg-purple-500 px-5 py-3 rounded-xl">Compare</button>
        </div>

        {comparison && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-green-300">Best Price</h3>
              <p>{comparison.best_price.vendor_name}</p>
              <p>₹{comparison.best_price.price}</p>
            </div>
            <div className="bg-cyan-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-cyan-300">Fastest Delivery</h3>
              <p>{comparison.fastest_delivery.vendor_name}</p>
              <p>{comparison.fastest_delivery.delivery_days} days</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-purple-300">Recommended</h3>
              <p>{comparison.recommended.vendor_name}</p>
              <p>₹{comparison.recommended.price}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th>RFQ</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Delivery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q.id} className="border-t border-white/10">
                <td className="p-4">{q.id}</td>
                <td>{q.rfq_id}</td>
                <td>{q.vendor_name}</td>
                <td>₹{q.price}</td>
                <td>{q.delivery_days} days</td>
                <td>{q.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default Quotations;