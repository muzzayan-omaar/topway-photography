import { useState, useEffect } from "react";
import { User, Lock, Save, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import axios from "../../api/axios";

export default function Settings() {
  const [toast, setToast] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  // Username Form
  const [usernameForm, setUsernameForm] = useState({ newUsername: "" });
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const API_URL = import.meta.env.VITE_API_URL || "";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Current Username
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUsername(data.username || "");
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      showToast("Failed to load current username", "error");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update Username
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    if (!usernameForm.newUsername.trim()) {
      showToast("Please enter a new username", "error");
      return;
    }

    setUsernameLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_URL}/api/settings/username`,
        { newUsername: usernameForm.newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentUsername(usernameForm.newUsername);
      showToast("Username updated successfully!", "success");
      setUsernameForm({ newUsername: "" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update username";
      showToast(errorMsg, "error");
    } finally {
      setUsernameLoading(false);
    }
  };

  // Update Password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill all password fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_URL}/api/settings/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Password updated successfully!", "success");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update password";
      showToast(errorMsg, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-white/60 mt-2">Manage your account credentials</p>
        </div>

        <div className="space-y-12">
          {/* Username Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/10 rounded-2xl">
                <User className="w-8 h-8 text-[#d8b88a]" />
              </div>
              <div>
                <h2 className="text-2xl font-medium">Username</h2>
                <p className="text-white/60">Update your login username</p>
              </div>
            </div>

            <form onSubmit={handleUsernameUpdate} className="max-w-md space-y-6">
              <div>
                <label className="text-sm text-white/60 block mb-2">Current Username</label>
                <input
                  type="text"
                  value={currentUsername}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white/50"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-2">New Username</label>
                <input
                  type="text"
                  value={usernameForm.newUsername}
                  onChange={(e) => setUsernameForm({ newUsername: e.target.value })}
                  placeholder="Enter new username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#d8b88a] transition"
                />
              </div>

              <button
                type="submit"
                disabled={usernameLoading}
                className="px-8 py-3.5 bg-[#d8b88a] hover:bg-[#f0d9a8] disabled:opacity-70 text-black rounded-2xl font-medium flex items-center gap-2 transition"
              >
                {usernameLoading ? "Updating..." : "Update Username"}
                <Save size={18} />
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Lock className="w-8 h-8 text-[#d8b88a]" />
              </div>
              <div>
                <h2 className="text-2xl font-medium">Change Password</h2>
                <p className="text-white/60">Keep your account secure</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
              <div>
                <label className="text-sm text-white/60 block mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#d8b88a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    className="absolute right-4 top-4 text-white/60 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#d8b88a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute right-4 top-4 text-white/60 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#d8b88a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-4 top-4 text-white/60 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-4 bg-[#d8b88a] hover:bg-[#f0d9a8] disabled:opacity-70 text-black rounded-2xl font-medium flex items-center justify-center gap-2 transition mt-4"
              >
                {passwordLoading ? "Updating Password..." : "Update Password"}
                <Save size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600 border-emerald-500 text-white"
              : "bg-red-600 border-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={22} /> : <XCircle size={22} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}