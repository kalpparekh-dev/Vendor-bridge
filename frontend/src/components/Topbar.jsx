import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold">Procurement Control Center</h2>
        <p className="text-sm text-gray-400">Live VendorBridge ERP</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-cyan-400/20 px-4 py-2 rounded-full text-cyan-300">
          {user.role || "Admin"}
        </div>
        <button
          onClick={logout}
          className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;