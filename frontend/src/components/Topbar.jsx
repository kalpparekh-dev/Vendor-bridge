import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaCog, FaTimes } from "react-icons/fa";

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <>
      <header className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8">
        <div>
          <h2 className="text-xl font-semibold">Procurement Control Center</h2>
          <p className="text-sm text-gray-400">Live VendorBridge ERP</p>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 w-80">
          <FaSearch className="text-gray-400" />
          <input
            placeholder="Search vendors, RFQs, invoices..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative bg-white/10 p-3 rounded-xl hover:bg-white/20"
          >
            <FaBell className="text-cyan-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="bg-white/10 p-3 rounded-xl hover:bg-white/20"
          >
            <FaCog className="text-gray-300" />
          </button>

          <div className="bg-cyan-400/20 px-4 py-2 rounded-full text-cyan-300">
            {user.role || "admin"}
          </div>

          <button
            onClick={logout}
            className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30"
          >
            Logout
          </button>
        </div>
      </header>

      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-96 h-full bg-[#0b1025] border-l border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold text-cyan-300">New RFQ Created</p>
                <p className="text-sm text-gray-300">Office laptop procurement is open.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold text-green-300">Quotation Submitted</p>
                <p className="text-sm text-gray-300">Dell India submitted a quotation.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold text-orange-300">Approval Pending</p>
                <p className="text-sm text-gray-300">Manager approval required for quotation #1.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="w-full max-w-lg bg-[#0b1025] border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold">User</p>
                <p className="text-gray-400">{user.name || "Admin User"}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold">Email</p>
                <p className="text-gray-400">{user.email || "admin@vendorbridge.com"}</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="font-semibold">Role</p>
                <p className="text-cyan-300">{user.role || "admin"}</p>
              </div>

              <button
                onClick={logout}
                className="w-full bg-red-500/20 text-red-300 py-3 rounded-xl hover:bg-red-500/30"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;