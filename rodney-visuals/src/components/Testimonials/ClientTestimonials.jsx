
import { useEffect, useState } from "react";
import api from "../../api/axios";

import { motion } from "framer-motion";

export default function ClientTestimonials() {
  

  const [active, setActive] = useState(0);

  const [testimonials, setTestimonials] = useState([]);

useEffect(() => {
  const fetchTestimonials = async () => {
  try {
    const res = await api.get("/api/testimonials");

    const data = res.data;

    // handle all possible backend shapes safely
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.testimonials)
      ? data.testimonials
      : [];

    setTestimonials(list);
  } catch (err) {
    console.log(err);
  }
};

  fetchTestimonials();
}, []);

  // AUTO SLIDE (clean + safe dependency)
useEffect(() => {
  if (!testimonials.length) return;

  const interval = setInterval(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, 4500);

  return () => clearInterval(interval);
}, [testimonials.length]);


  return (
    <section
      id="clients"
      className="relative bg-[#080808] py-28 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT SIDE ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[0.35em] text-[#d8b88a] text-xs mb-4">
              Testimonials
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-light mb-5">
              Voices From Clients
            </h2>

            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Every project is a story. These are reflections from clients who
              experienced our cinematic approach to photography and film.
            </p>
          </motion.div>

          {/* ================= RIGHT STACK ================= */}
          <div className="relative h-[420px]">

            {Array.isArray(testimonials) &&
  testimonials.map((item, index) => {
              const isActive = index === active;
              const offset = index - active;

              return (
                <motion.div
                  key={item._id}
                  className="absolute right-0 w-full max-w-md"
                  style={{
                    zIndex: isActive ? 10 : 1,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  initial={{ opacity: 0, scale: 0.9, x: 60 }}
                  animate={{
                    opacity: isActive ? 1 : 0.25,
                    scale: isActive ? 1 : 0.88,
                    x: isActive ? 0 : 40,
                    y: offset * 70,
                    rotate: -6,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                >
                  {/* CARD */}
                  <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">

                    {/* diagonal glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-40 pointer-events-none" />
                      <div className="flex gap-1 mb-3">
  {[...Array(5)].map((_, i) => (
    <span
      key={i}
      className={`text-sm ${
        i < item.rating ? "text-[#d8b88a]" : "text-white/20"
      }`}
    >
      ★
    </span>
  ))}
</div>
                    {/* TEXT */}
                    <p className="text-white/80 text-sm leading-relaxed relative">
                      “{item.text}”
                    </p>

                    {/* FOOTER */}
                    <div className="mt-5 relative">
                      <h4 className="text-[#d8b88a] font-serif">
                        {item.name}
                      </h4>
                      <p className="text-white/40 text-xs uppercase tracking-[0.2em]">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}