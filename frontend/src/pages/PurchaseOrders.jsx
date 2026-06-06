import { useEffect, useState } from "react";
import API from "../services/api";

function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [quotationId, setQuotationId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await API.get("/purchase-orders");
    setOrders(res.data);
  }

  async function generatePO(e) {
    e.preventDefault();
    await API.post("/purchase-orders", {
      quotation_id: quotationId,
      user_id: 1,
    });
    setQuotationId("");
    fetchOrders();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Purchase Orders</h1>

      <form onSubmit={generatePO} className="flex gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input value={quotationId} onChange={(e) => setQuotationId(e.target.value)} placeholder="Approved Quotation ID" className="input" />
        <button className="bg-cyan-400 text-black px-5 rounded-xl font-semibold">Generate PO</button>
      </form>

      <div className="grid gap-4">
        {orders.map((po) => (
          <div key={po.id} className="bg-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-bold">{po.po_number}</h2>
            <p>Vendor: {po.vendor_name}</p>
            <p>Total: ₹{po.total_amount}</p>
            <p>GST 18%: ₹{po.tax_amount}</p>
            <p className="text-cyan-300">Grand Total: ₹{po.grand_total}</p>
          </div>
        ))}
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default PurchaseOrders;