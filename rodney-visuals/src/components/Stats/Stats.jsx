import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Camera, Calendar, Briefcase } from "lucide-react";

import aboutImg from "../../assets/images/about.jpg";

/* ================= COUNTER (FIXED) ================= */
function Counter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
  });

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.floor(latest));
    });

    return () => unsubscribe();
  }, [spring]);

  return (
    <span
      ref={ref}
      className="text-2xl md:text-3xl font-serif text-white"
    >
      {display}
      <span className="text-[#d8b88a]">+</span>
    </span>
  );
}

/* ================= MAIN ================= */
export default function Stats() {
  const stats = [
    {
      id: 1,
      icon: <Camera size={20} />,
      value: 7,
      label: "Years Experience",
    },
    {
      id: 2,
      icon: <Calendar size={20} />,
      value: 120,
      label: "Happy Clients",
    },
    {
      id: 3,
      icon: <Briefcase size={20} />,
      value: 350,
      label: "Projects Completed",
    },
  ];

  return (
    <section id="about" className="relative bg-[#080808] py-28 overflow-hidden">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-12 items-center">

          {/* ================= IMAGE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <motion.div
              whileInView={{ y: [15, -5, 0] }}
              transition={{ duration: 1.8 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src={aboutImg}
                alt="About"
                className="h-[420px] w-full object-cover"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ================= TEXT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <p className="uppercase tracking-[0.3em] text-[#d8b88a] text-xs mb-3">
              About
            </p>

            <h2 className="font-serif text-3xl md:text-4xl font-light mb-5">
              Crafting Visual Stories With Precision & Emotion
            </h2>

            <p className="text-white/60 text-sm leading-relaxed mb-4">
              We create cinematic visuals that blend storytelling, emotion, and
              technical precision to produce timeless imagery.
            </p>

            <p className="text-white/40 text-sm leading-relaxed">
              Every project is treated like a film — intentional, layered, and
              visually immersive.
            </p>
          </motion.div>

{/* ================= STATS ================= */}
<div className="md:col-span-1">

  <div className="flex flex-row md:flex-col gap-6 md:gap-8 justify-between md:justify-start">

    {stats.map((stat, index) => (
      <motion.div
        key={stat.id}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15 }}
        viewport={{ once: true }}
        className="
          relative
          flex-1
          md:flex-none
          md:pl-6
          group
        "
      >

        {/* timeline line (desktop only) */}
        <div className="
          hidden md:block
          absolute left-0 top-0 bottom-0 w-[1px]
          bg-gradient-to-b from-transparent via-white/10 to-transparent
        " />

        {/* icon with glow */}
        <div className="text-[#d8b88a] mb-2 relative flex justify-center md:justify-start">
          <span className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition">
            {stat.icon}
          </span>
          <span className="relative">{stat.icon}</span>
        </div>

        {/* counter */}
        <div className="text-center md:text-left">
          <Counter value={stat.value} />
        </div>

        {/* label */}
        <p className="text-white/50 text-[10px] md:text-[11px] uppercase tracking-[0.2em] mt-1 text-center md:text-left">
          {stat.label}
        </p>

      </motion.div>
    ))}

  </div>

</div>
        </div>
      </div>
    </section>
  );
}