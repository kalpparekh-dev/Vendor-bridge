import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center">
          Vendor<span className="text-cyan-400">Bridge</span>
        </h1>
        <p className="text-center text-gray-400 mt-2">Procurement ERP Login</p>

        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-xl mt-5">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none" />

          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none" />

          <button className="w-full bg-cyan-400 text-black font-semibold py-3 rounded-xl">
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          New user? <Link to="/signup" className="text-cyan-400">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;