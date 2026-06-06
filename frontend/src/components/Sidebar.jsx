import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaClipboardList,
  FaFileInvoice,
  FaCheckCircle,
  FaShoppingCart,
  FaHistory,
} from "react-icons/fa";

function Sidebar() {
  const items = [
    { name: "Dashboard", path: "/dashboard", icon: <FaChartPie /> },
    { name: "Vendors", path: "/vendors", icon: <FaUsers /> },
    { name: "RFQs", path: "/rfqs", icon: <FaClipboardList /> },
    { name: "Quotations", path: "/quotations", icon: <FaFileInvoice /> },
    { name: "Approvals", path: "/approvals", icon: <FaCheckCircle /> },
    { name: "Purchase Orders", path: "/purchase-orders", icon: <FaShoppingCart /> },
    { name: "Invoices", path: "/invoices", icon: <FaFileInvoice /> },
    { name: "Activity Logs", path: "/logs", icon: <FaHistory /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white/10 backdrop-blur-xl border-r border-white/10 p-6">
      <h1 className="text-2xl font-bold mb-10">
        Vendor<span className="text-cyan-400">Bridge</span>
      </h1>

      <nav className="space-y-3">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-cyan-400/20 text-cyan-300"
                  : "hover:bg-white/10 text-gray-300"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;