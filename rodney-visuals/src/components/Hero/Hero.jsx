import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import heroImage from "../../assets/images/hero.jpg";
import { useEffect, useState } from "react";


function ScrollProgress() {
  const [scroll, setScroll] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = (window.scrollY / total) * 100;
      setScroll(progress);

      const y = window.scrollY;

      if (y < window.innerHeight * 0.8) setActiveSection("hero");
      else if (y < window.innerHeight * 1.8) setActiveSection("work");
      else if (y < window.innerHeight * 2.8) setActiveSection("about");
      else setActiveSection("contact");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dots = ["hero", "work", "about", "contact"];

  return (
    <>
      {/* ================= DESKTOP (RIGHT SIDE) ================= */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-6">

        {/* Progress Line */}
        <div className="relative h-44 w-[2px] bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#d8b88a] via-[#f5e1c8] to-[#d8b88a] shadow-[0_0_20px_rgba(216,184,138,0.6)] transition-all duration-150"
            style={{ height: `${scroll}%` }}
          />
        </div>

        {/* Dots */}
        <div className="flex flex-col gap-4 items-center">
          {dots.map((dot) => (
            <div key={dot} className="relative group cursor-pointer">
              <div
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-300
                  ${
                    activeSection === dot
                      ? "bg-[#d8b88a] scale-125 shadow-[0_0_15px_rgba(216,184,138,0.7)]"
                      : "bg-white/30 hover:bg-white/60"
                  }
                `}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] tracking-widest text-white/60 opacity-0 group-hover:opacity-100 transition-all capitalize">
                {dot}
              </span>
            </div>
          ))}
        </div>

        <span className="text-[10px] tracking-[0.3em] text-white/40 rotate-90">
          SCROLL
        </span>
      </div>

      {/* ================= MOBILE (BOTTOM BAR) ================= */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">

        <div className="flex items-center gap-4 px-4 py-2 rounded-full backdrop-blur-xl bg-black/30 border border-white/10">

          {/* Progress bar */}
          <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d8b88a] shadow-[0_0_10px_rgba(216,184,138,0.6)] transition-all duration-150"
              style={{ width: `${scroll}%` }}
            />
          </div>

          {/* Active section dot */}
          <div className="flex items-center gap-2">
            {dots.map((dot) => (
              <div
                key={dot}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${
                    activeSection === dot
                      ? "bg-[#d8b88a] scale-125"
                      : "bg-white/30"
                  }
                `}
              />
            ))}
          </div>

          {/* Label */}
          <span className="text-[9px] tracking-[0.25em] text-white/50">
            SCROLL
          </span>

        </div>
      </div>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Scroll indicator */}
      <ScrollProgress />

      {/* Background Image */}
      <img
        src={heroImage}
        alt="hero"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#080808] to-transparent" />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-5 sm:px-6 md:px-8">
        <div className="max-w-3xl text-center">

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] md:tracking-[0.45em] text-[#d8b88a]"
          >
            PHOTOGRAPHER • FILMMAKER • STORYTELLER
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl px-2 leading-[0.95] font-light tracking-tight">
              Topway{" "}
              <span className="signature-font text-[#d8b88a] font-normal ml-2">
                Visuals
              </span>
            </h1>

            <div className="mt-5 min-h-[60px] text-sm sm:text-base md:text-lg text-[#d8b88a] tracking-wide">
              <TypeAnimation
                sequence={[
                  "Crafting Timeless Visual Stories",
                  2500,
                  "Capturing Life Through The Lens",
                  2500,
                  "Photography • Film • Storytelling",
                  2500,
                  "Turning Moments Into Memories",
                  2500,
                ]}
                speed={80}
                repeat={Infinity}
                cursor={false}
              />
            </div>

            <div className="flex justify-center mt-6">
              <div className="w-20 h-px bg-[#d8b88a]/70" />
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <button className="w-full max-w-[260px] sm:w-auto px-7 py-3 rounded-full text-sm cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              Book Now!
            </button>

            <button className="w-full max-w-[260px] sm:w-auto px-7 py-3 rounded-full text-sm cursor-pointer backdrop-blur-xl bg-black/20 border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              Follow on Instagram
            </button>
          </div>

          {/* Scroll arrow */}
          <div className="mt-10 flex justify-center">
            <div className="animate-bounce">
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}