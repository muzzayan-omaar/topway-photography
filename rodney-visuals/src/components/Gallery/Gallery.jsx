import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

const fetchGallery = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/gallery`);

    let galleryData = [];
    if (Array.isArray(data)) {
      galleryData = data;
    } else if (data?.data && Array.isArray(data.data)) {
      galleryData = data.data;
    } else if (data?.works && Array.isArray(data.works)) {
      galleryData = data.works;
    }

    setWorks(galleryData);
    setError(null);
  } catch (err) {
    console.error("Failed to fetch gallery:", err);
    setError("Failed to load works. Please try again later.");
    setWorks([]);
  } finally {
    setLoading(false);
  }
};

    fetchGallery();
  }, []);

  const categories = ["All", ...new Set(
    works.filter(w => w?.category).map((w) => w.category)
  )];

  const filteredWorks = selectedFilter === "All"
    ? works
    : works.filter((w) => w?.category === selectedFilter);

  // Close with Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section id="work" className="relative bg-[#080808] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <p className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#d8b88a] text-[10px] md:text-xs mb-2 md:mb-3">
            PORTFOLIO
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light leading-tight">
            Selected Works
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] uppercase rounded-full border transition-all duration-300 ${
                  selectedFilter === cat
                    ? "bg-[#d8b88a] text-black border-[#d8b88a]"
                    : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-center text-white/50 py-12">Loading works...</p>}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {/* Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filteredWorks.map((work, index) => (
            <motion.div
              key={work._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedImage(work)}
              className="mb-5 break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl bg-zinc-950">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 transition-all">
                  <p className="text-[#d8b88a] text-xs tracking-widest">{work.category}</p>
                  <h3 className="text-lg font-serif text-white mt-1">{work.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && !error && filteredWorks.length === 0 && (
          <p className="text-center text-white/50 py-10">No works found.</p>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="text-[#d8b88a] tracking-widest text-sm hover:tracking-[0.5em] transition-all">
            VIEW FULL PORTFOLIO →
          </button>
        </div>
      </div>

      {/* Lightbox - Fixed version */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl transition-colors z-10"
            >
              ×
            </button>

            <motion.div
              key={`image-${selectedImage._id}`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />

              <div className="text-center mt-5">
                <p className="text-[#d8b88a] uppercase text-[11px] tracking-[0.25em]">
                  {selectedImage.category}
                </p>
                <h3 className="text-xl md:text-2xl font-serif text-white mt-2">
                  {selectedImage.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}