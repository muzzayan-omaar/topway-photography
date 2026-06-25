import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Edit2, Trash2 } from "lucide-react";

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await axios.get("/api/testimonials");
    setItems(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (editingId) {
      await axios.put(`/api/testimonials/${editingId}`, form);
    } else {
      await axios.post("/api/testimonials", form);
    }

    setForm({ name: "", role: "", text: "", rating: 5 });
    setEditingId(null);
    fetchData();
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (item) => {
  setForm({
    name: item.name,
    role: item.role,
    text: item.text,
    rating: item.rating || 5,
  });

  setEditingId(item._id);
};

  const handleDelete = async (id) => {
    await axios.delete(`/api/testimonials/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Testimonials Manager</h1>

      <div className="bg-black/40 border border-white/10 p-6 rounded-xl space-y-4">
  <h2 className="text-lg font-semibold text-white">
    Add / Edit Testimonial
  </h2>

  <input
    placeholder="Client Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    className="w-full p-3 bg-black border border-white/10 rounded-lg"
  />

  <input
    placeholder="Role (e.g. Wedding Client)"
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full p-3 bg-black border border-white/10 rounded-lg"
  />

  <textarea
    placeholder="Testimonial text..."
    value={form.text}
    onChange={(e) => setForm({ ...form, text: e.target.value })}
    className="w-full p-3 bg-black border border-white/10 rounded-lg min-h-[120px]"
  />

  {/* ⭐ STAR SELECTOR */}
  <div>
    <p className="text-white/60 text-sm mb-2">Rating</p>
    <div className="flex gap-2 text-2xl cursor-pointer">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setForm({ ...form, rating: star })}
          className={`transition ${
            Number(form.rating) >= star
              ? "text-[#d8b88a]"
              : "text-white/20"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  </div>

  <button
    onClick={handleSubmit}
    disabled={loading}
    className="w-full py-3 bg-[#d8b88a] text-black font-medium rounded-lg hover:opacity-90 transition"
  >
    {loading ? "Saving..." : editingId ? "Update Testimonial" : "Add Testimonial"}
  </button>
</div>

      {/* LIST */}
      <div className="grid gap-4 mt-6">
  {items.map((item) => (
    <div
      key={item._id}
      className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between"
    >
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-white/40 text-sm">{item.role}</p>

        {/* stars */}
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={
                i < item.rating
                  ? "text-[#d8b88a]"
                  : "text-white/20"
              }
            >
              ★
            </span>
          ))}
        </div>

        <p className="text-white/60 text-sm mt-2">
          {item.text}
        </p>
      </div>

      <div className="flex gap-3 items-start">
        <button onClick={() => handleEdit(item)}>✏️</button>
        <button onClick={() => handleDelete(item._id)}>🗑</button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}