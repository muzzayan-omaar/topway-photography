import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ClientTestimonials() {
  const testimonials = [
    {
      id: 1,
      text: "Every frame felt like a cinematic masterpiece. Truly exceptional storytelling.",
      name: "Sarah M.",
      role: "Wedding Client",
    },
    {
      id: 2,
      text: "The visuals were beyond expectations. Elegant, emotional, and powerful.",
      name: "Daniel K.",
      role: "Brand Shoot",
    },
    {
      id: 3,
      text: "He doesn’t just take photos — he captures feelings in motion.",
      name: "Ayesha R.",
      role: "Portrait Session",
    },
    {
      id: 4,
      text: "A premium experience from start to finish. Pure cinematic quality.",
      name: "Michael T.",
      role: "Event Client",
    },
  ];

  const [active, setActive] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="clients" className="relative bg-[#080808] py-28 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT TEXT ================= */}
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

          {/* ================= RIGHT DIAGONAL STACK ================= */}
          <div className="relative h-[420px]">

            <AnimatePresence mode="wait">
              {testimonials.map((item, index) => {
                const isActive = index === active;

                return (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      x: 60,
                      scale: 0.9,
                      rotate: -6,
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.25,
                      scale: isActive ? 1 : 0.85,
                      x: isActive ? 0 : 40,
                      rotate: -6,
                      y: (index - active) * 70,
                      zIndex: isActive ? 10 : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="
                      absolute
                      right-0
                      w-full
                      max-w-md
                    "
                  >

                    {/* CARD */}
                    <div className="
                      bg-white/5
                      border border-white/10
                      backdrop-blur-xl
                      rounded-2xl
                      p-6
                      shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                    ">

                      {/* diagonal accent line */}
                      <div className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-transparent
                        via-white/5
                        to-transparent
                        opacity-40
                        pointer-events-none
                      " />

                      {/* TEXT */}
                      <p className="text-white/80 text-sm leading-relaxed">
                        “{item.text}”
                      </p>

                      <div className="mt-5">
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
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}