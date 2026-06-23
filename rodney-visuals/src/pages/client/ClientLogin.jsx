import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

export default function ClientLogin() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${API_URL}/api/clients/login`,
        {
          slug,
          password,
        }
      );

      localStorage.setItem(
        `client-${slug}`,
        "authorized"
      );

      navigate(`/client/${slug}/dashboard`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif">
            NOVA
          </h1>

          <p className="text-white/50 mt-2">
            Client Media Portal
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="password"
            placeholder="Enter Project Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#d8b88a] text-black rounded-2xl font-medium hover:bg-[#c9a675] transition"
          >
            {loading
              ? "Checking..."
              : "Access Project"}
          </button>
        </form>

      </div>
    </div>
  );
}