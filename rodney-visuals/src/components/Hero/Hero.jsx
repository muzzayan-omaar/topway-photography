import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";   // ← Make sure this path is correct

function ScrollProgress() {
  const [scroll, setScroll] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  const dots = ["hero", "work", "about", "where", "clients", "cta"];

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      setScroll(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-6">
        <span className="text-[10px] tracking-[0.35em] text-[#d8b88a] uppercase">
          {activeSection}
        </span>

        <div className="relative h-44 w-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#d8b88a] via-[#f5e1c8] to-[#d8b88a] transition-all duration-200 shadow-[0_0_20px_rgba(216,184,138,0.7)]"
            style={{ height: `${scroll}%` }}
          />
        </div>

        <div className="flex flex-col gap-4 items-center">
          {dots.map((dot) => (
            <button
              key={dot}
              onClick={() => document.getElementById(dot)?.scrollIntoView({ behavior: "smooth" })}
              className="relative group"
            >
              <motion.div
                animate={{ scale: activeSection === dot ? 1.5 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-2.5 h-2.5 rounded-full ${
                  activeSection === dot
                    ? "bg-[#d8b88a] shadow-[0_0_15px_rgba(216,184,138,0.8)]"
                    : "bg-white/30"
                }`}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] tracking-widest text-white/60 opacity-0 group-hover:opacity-100 transition-all capitalize">
                {dot}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-4 py-2 rounded-full backdrop-blur-xl bg-black/30 border border-white/10">
          <div className="w-28 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d8b88a] transition-all duration-150"
              style={{ width: `${scroll}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {dots.map((dot) => (
              <div
                key={dot}
                className={`w-1.5 h-1.5 rounded-full ${
                  activeSection === dot ? "bg-[#d8b88a] scale-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <span className="text-[9px] uppercase tracking-[0.25em] text-[#d8b88a]">
            {activeSection}
          </span>
        </div>
      </div>
    </>
  );
}

export default function Hero() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic hero data
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/hero`);
        setHeroData(res.data || {});
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
        // Fallback to old hardcoded values if you want
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <section id="hero" className="relative min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white/60">Loading hero...</div>
      </section>
    );
  }

  const {
    tagline = "PHOTOGRAPHY • FILMMAKING • STORYTELLING",
    title = "Topway Visuals",
    animatedTexts = [
      "Crafting Timeless Visual Stories",
      "Capturing Life Through The Lens",
      "Photography • Film • Storytelling",
      "Turning Moments Into Memories",
    ],
    primaryButtonText = "Book Now!",
    primaryButtonLink = "#",
    secondaryButtonText = "Follow on Instagram",
    secondaryButtonLink = "#",
    heroImage,
  } = heroData;

  // Build TypeAnimation sequence from dynamic array
  const typeSequence = animatedTexts.flatMap((text) => [text, 2500]);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      <ScrollProgress />

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage || "/path/to/fallback.jpg"}   // fallback if needed
          alt="hero"
          className="h-full w-full object-cover object-center scale-110"
          style={{
            transform: `translateY(${offset * -1}px) scale(1.1)`,
          }}
        />
      </div>

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
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl px-2 leading-[0.95] font-light tracking-tight">
              {title}
            </h1>

            <div className="mt-5 min-h-[60px] text-sm sm:text-base md:text-lg text-[#d8b88a] tracking-wide">
              <TypeAnimation
                sequence={typeSequence}
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
            <a
              href={primaryButtonLink}
              className="w-full max-w-[260px] sm:w-auto px-7 py-3 rounded-full text-sm cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)] inline-block text-center"
            >
              {primaryButtonText}
            </a>

            <a
              href={secondaryButtonLink}
              className="w-full max-w-[260px] sm:w-auto px-7 py-3 rounded-full text-sm cursor-pointer backdrop-blur-xl bg-black/20 border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.25)] inline-block text-center"
            >
              {secondaryButtonText}
            </a>
          </div>

          {/* Scroll arrow */}
          <div className="mt-10 flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}