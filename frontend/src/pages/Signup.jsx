import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center">
          Create <span className="text-cyan-400">Account</span>
        </h1>

        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-xl mt-5">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none" />

          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none" />

          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none" />

          <select name="role" value={form.role} onChange={handleChange}
            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none">
            <option value="admin">Admin</option>
            <option value="procurement_officer">Procurement Officer</option>
            <option value="vendor">Vendor</option>
            <option value="manager">Manager</option>
          </select>

          <button className="w-full bg-cyan-400 text-black font-semibold py-3 rounded-xl">
            Signup
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have account? <Link to="/" className="text-cyan-400">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;