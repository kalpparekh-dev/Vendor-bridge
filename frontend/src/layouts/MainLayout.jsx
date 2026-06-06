import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0a0f2e] to-[#091321] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;