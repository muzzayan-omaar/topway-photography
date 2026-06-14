import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

export default function HeroManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState({
    tagline: "",
    title: "",
    animatedTexts: [],
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // ================= FETCH HERO =================
  const fetchHero = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/hero`);

      const data = res.data || {};

      setHero({
        tagline: data.tagline || "",
        title: data.title || "",
        animatedTexts: data.animatedTexts || [],
        primaryButtonText: data.primaryButtonText || "",
        primaryButtonLink: data.primaryButtonLink || "",
        secondaryButtonText: data.secondaryButtonText || "",
        secondaryButtonLink: data.secondaryButtonLink || "",
      });

      setPreview(data.heroImage || "");
    } catch (err) {
      console.log("Fetch hero error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  // ================= IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ================= TEXTS =================
  const addText = () => {
    setHero({ ...hero, animatedTexts: [...hero.animatedTexts, ""] });
  };

  const updateText = (index, value) => {
    const updated = [...hero.animatedTexts];
    updated[index] = value;
    setHero({ ...hero, animatedTexts: updated });
  };

  const removeText = (index) => {
    setHero({
      ...hero,
      animatedTexts: hero.animatedTexts.filter((_, i) => i !== index),
    });
  };

  // ================= SAVE =================
// ================= SAVE =================
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);


 const token = localStorage.getItem("adminToken");
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("📋 Token Payload:", payload);
    console.log("⏰ Expires at:", new Date(payload.exp * 1000).toLocaleString());
    console.log("🕒 Current time:", new Date().toLocaleString());
    
    if (payload.exp * 1000 < Date.now()) {
      console.log("❌ TOKEN IS EXPIRED!");
      alert("Your session has expired. Please log in again.");
    }
  } catch (e) {
    console.log("❌ Cannot decode token");
  }
}

    const formData = new FormData();
    formData.append("tagline", hero.tagline);
    formData.append("title", hero.title);
    formData.append("animatedTexts", JSON.stringify(hero.animatedTexts));
    formData.append("primaryButtonText", hero.primaryButtonText);
    formData.append("primaryButtonLink", hero.primaryButtonLink);
    formData.append("secondaryButtonText", hero.secondaryButtonText);
    formData.append("secondaryButtonLink", hero.secondaryButtonLink);

    if (imageFile) {
      formData.append("heroImage", imageFile);
    }

    

    const res = await axios.put(`${API_URL}/api/hero`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Save successful:", res.data);
    await fetchHero();
    setImageFile(null);
    alert("Hero updated successfully!");

  } catch (err) {
    console.error("❌ Full error:", err.response || err);
    
    if (err.response?.status === 401) {
      alert("Authentication failed. Token may be invalid or expired.");
      console.log("Response data:", err.response?.data);
    } else {
      alert("Failed to save changes.");
    }
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="text-white/60 p-6">
        Loading hero section...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-serif">Hero Section</h2>
        <p className="text-white/50 mt-1">
          Manage homepage hero content
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6"
      >

        {/* TEXT FIELDS */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="tagline"
            value={hero.tagline}
            onChange={handleChange}
            placeholder="Tagline"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
          />

          <input
            name="title"
            value={hero.title}
            onChange={handleChange}
            placeholder="Title"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl focus:outline-none focus:border-[#d8b88a]"
          />
        </div>

        {/* ANIMATED TEXTS */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Animated Texts</h3>

            <button
              type="button"
              onClick={addText}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {hero.animatedTexts.map((text, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => updateText(i, e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 px-4 py-2 rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => removeText(i)}
                  className="px-3 rounded-xl bg-red-500/20 text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="primaryButtonText"
            value={hero.primaryButtonText}
            onChange={handleChange}
            placeholder="Primary Button Text"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl"
          />

          <input
            name="primaryButtonLink"
            value={hero.primaryButtonLink}
            onChange={handleChange}
            placeholder="Primary Button Link"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl"
          />

          <input
            name="secondaryButtonText"
            value={hero.secondaryButtonText}
            onChange={handleChange}
            placeholder="Secondary Button Text"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl"
          />

          <input
            name="secondaryButtonLink"
            value={hero.secondaryButtonLink}
            onChange={handleChange}
            placeholder="Secondary Button Link"
            className="bg-black/40 border border-white/10 px-4 py-3 rounded-2xl"
          />
        </div>

        {/* IMAGE */}
        <div>
          <input type="file" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              className="mt-4 w-full h-60 object-cover rounded-2xl border border-white/10"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-[#d8b88a] text-black font-medium"
          >
            {saving ? "Saving..." : "Save Hero"}
          </button>

          <button
            type="button"
            onClick={fetchHero}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}