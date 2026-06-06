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
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "admin";

  const allItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaChartPie />, roles: ["admin", "procurement_officer", "manager", "vendor"] },
    { name: "Vendors", path: "/vendors", icon: <FaUsers />, roles: ["admin", "procurement_officer"] },
    { name: "RFQs", path: "/rfqs", icon: <FaClipboardList />, roles: ["admin", "procurement_officer", "vendor"] },
    { name: "Quotations", path: "/quotations", icon: <FaFileInvoice />, roles: ["admin", "procurement_officer", "vendor"] },
    { name: "Approvals", path: "/approvals", icon: <FaCheckCircle />, roles: ["admin", "manager"] },
    { name: "Purchase Orders", path: "/purchase-orders", icon: <FaShoppingCart />, roles: ["admin", "procurement_officer"] },
    { name: "Invoices", path: "/invoices", icon: <FaFileInvoice />, roles: ["admin", "procurement_officer", "vendor"] },
    { name: "Reports", path: "/reports", icon: <FaChartPie />, roles: ["admin", "manager"] },
    { name: "Activity Logs", path: "/logs", icon: <FaHistory />, roles: ["admin"] },
  ];

  const items = allItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white/10 backdrop-blur-xl border-r border-white/10 p-6">
      <h1 className="text-2xl font-bold mb-2">
        Vendor<span className="text-cyan-400">Bridge</span>
      </h1>

      <p className="text-gray-400 mb-8 capitalize">{role.replace("_", " ")}</p>

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