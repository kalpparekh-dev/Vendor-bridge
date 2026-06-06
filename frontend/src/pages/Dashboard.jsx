import { useEffect, useState } from "react";
import API from "../services/api";
import StatCard from "../components/StatCard";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">VendorBridge Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Vendors" value={stats.total_vendors} subtitle="Registered vendors" />
        <StatCard title="Total RFQs" value={stats.total_rfqs} subtitle="Procurement requests" />
        <StatCard title="Active RFQs" value={stats.active_rfqs} subtitle="Currently open" />
        <StatCard title="Quotations" value={stats.total_quotations} subtitle="Vendor responses" />
        <StatCard title="Purchase Orders" value={stats.total_purchase_orders} subtitle="Generated POs" />
        <StatCard title="Invoices" value={stats.total_invoices} subtitle="Generated invoices" />
        <StatCard title="Approved Quotations" value={stats.approved_quotations} subtitle="Manager approved" />
        <StatCard title="Total Spend" value={`₹${stats.total_spend}`} subtitle="Invoice value" />
      </div>
    </div>
  );
}

export default Dashboard;