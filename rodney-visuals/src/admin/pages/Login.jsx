import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";   // ← Import this

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,     // ← Use API_URL here
        {
          username,
          password,
        }
      );

      // Important: You're saving as "adminToken", not "token"
      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || 
        "Login failed. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-serif text-center mb-2">
          Admin Login
        </h1>

        <p className="text-white/50 text-sm text-center mb-8">
          Rodney Visuals Dashboard
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#d8b88a] text-black font-medium"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}