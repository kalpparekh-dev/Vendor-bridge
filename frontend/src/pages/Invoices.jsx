import { useEffect, useState } from "react";
import API from "../services/api";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [poId, setPoId] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const res = await API.get("/invoices");
    setInvoices(res.data);
  }

  async function generateInvoice(e) {
    e.preventDefault();
    await API.post("/invoices", {
      po_id: poId,
      user_id: 1,
    });
    setPoId("");
    fetchInvoices();
  }

  function printInvoice(invoice) {
    const html = `
      <html>
        <head><title>${invoice.invoice_number}</title></head>
        <body style="font-family:Arial;padding:40px">
          <h1>VendorBridge Invoice</h1>
          <h2>${invoice.invoice_number}</h2>
          <p><b>PO Number:</b> ${invoice.po_number}</p>
          <p><b>Vendor:</b> ${invoice.vendor_name}</p>
          <p><b>Amount:</b> ₹${invoice.amount}</p>
          <p><b>GST:</b> ₹${invoice.tax}</p>
          <h2>Grand Total: ₹${invoice.grand_total}</h2>
        </body>
      </html>
    `;
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.print();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <form onSubmit={generateInvoice} className="flex gap-4 bg-white/10 p-6 rounded-2xl mb-8">
        <input value={poId} onChange={(e) => setPoId(e.target.value)} placeholder="Purchase Order ID" className="input" />
        <button className="bg-cyan-400 text-black px-5 rounded-xl font-semibold">Generate Invoice</button>
      </form>

      <div className="grid gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white/10 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{inv.invoice_number}</h2>
              <p>PO: {inv.po_number}</p>
              <p>Vendor: {inv.vendor_name}</p>
              <p>Amount: ₹{inv.amount}</p>
              <p>GST: ₹{inv.tax}</p>
              <p className="text-cyan-300">Grand Total: ₹{inv.grand_total}</p>
            </div>
            <button onClick={() => printInvoice(inv)} className="bg-purple-500 px-5 py-3 rounded-xl">
              Print Invoice
            </button>
          </div>
        ))}
      </div>

      <style>{`.input{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;outline:none}`}</style>
    </div>
  );
}

export default Invoices;