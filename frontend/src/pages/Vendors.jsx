import { useEffect, useState } from "react";
import API from "../services/api";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    vendor_name: "",
    category: "",
    gst_number: "",
    email: "",
    phone: "",
    status: "Active",
    rating: 4,
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    const res = await API.get("/vendors");
    setVendors(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function addVendor(e) {
    e.preventDefault();
    await API.post("/vendors", form);
    setForm({ vendor_name: "", category: "", gst_number: "", email: "", phone: "", status: "Active", rating: 4 });
    fetchVendors();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>

      <form onSubmit={addVendor} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input name="vendor_name" placeholder="Vendor Name" value={form.vendor_name} onChange={handleChange} className="input" />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input" />
        <input name="gst_number" placeholder="GST Number" value={form.gst_number} onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input" />
        <input name="rating" type="number" min="1" max="5" placeholder="Rating" value={form.rating} onChange={handleChange} className="input" />
        <button className="bg-cyan-400 text-black font-semibold rounded-xl px-4 py-3">Add Vendor</button>
      </form>

      <div className="bg-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Category</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GST</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border-t border-white/10">
                <td className="p-4">{v.vendor_name}</td>
                <td>{v.category}</td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td>{v.gst_number}</td>
                <td className="text-green-300">{v.status}</td>
                <td>⭐ {v.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default Vendors;