import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function PartnerCTA() {
  const partners = [
    {
      id: 1,
      name: "Sarah M.",
      role: "Wedding Client",
      text: "Absolutely cinematic experience. Every frame felt intentional and emotional.",
      stars: 5,
      logo: "S",
    },
    {
      id: 2,
      name: "Daniel K.",
      role: "Brand Shoot",
      text: "The visuals elevated our brand beyond expectations.",
      stars: 5,
      logo: "D",
    },
    {
      id: 3,
      name: "Ayesha R.",
      role: "Portrait Client",
      text: "It felt like being inside a movie production. Truly unforgettable.",
      stars: 5,
      logo: "A",
    },
  ];

  const [index, setIndex] = useState(0);

  // AUTO ROTATE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % partners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="cta" className="relative bg-[#080808] py-28 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6">

        {/* OUTER CONTAINER CARD (FRAME) */}
        <div className="
          relative
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          p-10 md:p-14
          shadow-[0_20px_80px_rgba(0,0,0,0.5)]
        ">

          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* ================= LEFT CTA ================= */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-[0.35em] text-[#d8b88a] text-xs mb-5">
                Trusted Experiences
              </p>

              <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight">
                Stories that build trust, frame by frame.
              </h2>

              <p className="text-white/50 text-sm mt-5 max-w-md leading-relaxed">
                Every client becomes part of a visual journey — not just a project.
              </p>

              <button className="mt-10 px-8 py-3 rounded-full bg-[#d8b88a] text-black text-sm hover:scale-105 transition">
                Start Your Story
              </button>
            </motion.div>

            {/* ================= RIGHT SPOTLIGHT ================= */}
            <div className="relative h-[260px] flex items-center justify-center">

              <AnimatePresence mode="wait">
                <motion.div
                  key={partners[index].id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="
                    w-full max-w-md
                    bg-black/30
                    border border-white/10
                    backdrop-blur-xl
                    rounded-2xl
                    p-6
                    shadow-[0_10px_40px_rgba(0,0,0,0.4)]
                  "
                >

                  {/* TOP ROW */}
                  <div className="flex items-center justify-between mb-4">

                    {/* LOGO */}
                    <div className="
                      w-10 h-10 rounded-full
                      flex items-center justify-center
                      bg-[#d8b88a]/10
                      border border-[#d8b88a]/30
                      text-[#d8b88a]
                      font-serif
                    ">
                      {partners[index].logo}
                    </div>

                    {/* STARS */}
                    <div className="flex gap-1 text-[#d8b88a]">
                      {Array.from({ length: partners[index].stars }).map((_, i) => (
                        <Star key={i} size={12} fill="#d8b88a" />
                      ))}
                    </div>

                  </div>

                  {/* TEXT */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    “{partners[index].text}”
                  </p>

                  {/* NAME */}
                  <div className="mt-5">
                    <h4 className="text-white font-serif">
                      {partners[index].name}
                    </h4>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em]">
                      {partners[index].role}
                    </p>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}