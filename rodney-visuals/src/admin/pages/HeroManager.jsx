import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";

const HeroManager = () => {
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

  // ================= GET HERO =================
    const fetchHero = async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${API_URL}/api/hero`);

    console.log("RAW RESPONSE:", res);
    console.log("DATA ONLY:", res.data);

    setHero(res.data);
  } catch (err) {
    console.log("Fetch hero error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchHero();
  }, []);

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  // ================= IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= ANIMATED TEXTS =================
  const addText = () => {
    setHero({
      ...hero,
      animatedTexts: [...hero.animatedTexts, ""],
    });
  };

  const updateText = (index, value) => {
    const updated = [...hero.animatedTexts];
    updated[index] = value;
    setHero({ ...hero, animatedTexts: updated });
  };

  const removeText = (index) => {
    const updated = hero.animatedTexts.filter((_, i) => i !== index);
    setHero({ ...hero, animatedTexts: updated });
  };

  // ================= SAVE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("tagline", hero.tagline);
      formData.append("title", hero.title);
      formData.append(
        "animatedTexts",
        JSON.stringify(hero.animatedTexts)
      );

      formData.append(
        "primaryButtonText",
        hero.primaryButtonText
      );
      formData.append(
        "primaryButtonLink",
        hero.primaryButtonLink
      );

      formData.append(
        "secondaryButtonText",
        hero.secondaryButtonText
      );
      formData.append(
        "secondaryButtonLink",
        hero.secondaryButtonLink
      );

      if (imageFile) {
        formData.append("heroImage", imageFile);
      }

      await axios.put(`${API_URL}/api/hero`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      alert("Hero updated successfully!");
      fetchHero();
    } catch (err) {
      console.log("Save error:", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading hero...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Hero Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Tagline */}
        <input
          name="tagline"
          value={hero.tagline}
          onChange={handleChange}
          placeholder="Tagline"
          className="w-full p-2 text-black"
        />

        {/* Title */}
        <input
          name="title"
          value={hero.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 text-black"
        />

        {/* Animated Texts */}
        <div>
          <h3 className="font-semibold">Animated Texts</h3>
          {(hero.animatedTexts || []).map((text, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={text}
                onChange={(e) =>
                  updateText(index, e.target.value)
                }
                className="flex-1 p-2 text-black"
              />
              <button
                type="button"
                onClick={() => removeText(index)}
                className="bg-red-500 px-3"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addText}
            className="bg-blue-500 px-3 py-1"
          >
            + Add Text
          </button>
        </div>

        {/* Buttons */}
        <input
          name="primaryButtonText"
          value={hero.primaryButtonText || ""}
          onChange={handleChange}
          placeholder="Primary Button Text"
          className="w-full p-2 text-black"
        />

        <input
          name="primaryButtonLink"
          value={hero.primaryButtonLink || ""}
          onChange={handleChange}
          placeholder="Primary Button Link"
          className="w-full p-2 text-black"
        />

        <input
          name="secondaryButtonText"
          value={hero.secondaryButtonText || ""}
          onChange={handleChange}
          placeholder="Secondary Button Text"
          className="w-full p-2 text-black"
        />

        <input
          name="secondaryButtonLink"
          value={hero.secondaryButtonLink || ""}
          onChange={handleChange}
          placeholder="Secondary Button Link"
          className="w-full p-2 text-black"
        />

        {/* Image Upload */}
        <div>
          <input
            type="file"
            onChange={handleImage}
          />

          {preview && (
            <img
              src={preview}
              alt="Hero"
              className="mt-3 w-full max-h-64 object-cover"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="bg-green-500 px-4 py-2"
        >
          {saving ? "Saving..." : "Save Hero"}
        </button>
      </form>
    </div>
  );
};

export default HeroManager;