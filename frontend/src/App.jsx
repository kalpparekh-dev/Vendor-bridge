import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import RFQs from "./pages/RFQs";
import Quotations from "./pages/Quotations";
import Approvals from "./pages/Approvals";
import PurchaseOrders from "./pages/PurchaseOrders";
import Invoices from "./pages/Invoices";
import ActivityLogs from "./pages/ActivityLogs";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/vendors" element={<MainLayout><Vendors /></MainLayout>} />
        <Route path="/rfqs" element={<MainLayout><RFQs /></MainLayout>} />
        <Route path="/quotations" element={<MainLayout><Quotations /></MainLayout>} />
        <Route path="/approvals" element={<MainLayout><Approvals /></MainLayout>} />
        <Route path="/purchase-orders" element={<MainLayout><PurchaseOrders /></MainLayout>} />
        <Route path="/invoices" element={<MainLayout><Invoices /></MainLayout>} />
        <Route path="/logs" element={<MainLayout><ActivityLogs /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;