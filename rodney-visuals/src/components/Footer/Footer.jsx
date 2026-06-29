import { motion } from "framer-motion";
import { FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] py-28 overflow-hidden">

      {/* Ambient cinematic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,184,138,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* BRAND (MAIN CREDIT) */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-5xl md:text-6xl font-light text-white"
        >
          Demo <span className="text-[#d8b88a]">Title</span>
        </motion.h2>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-white/40 text-xs md:text-sm tracking-[0.35em] uppercase"
        >
          Cinematic Photography • Film • Storytelling
        </motion.p>

        {/* SOFT DIVIDER */}
        <div className="flex justify-center mt-8">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d8b88a]/40 to-transparent" />
        </div>

        {/* CONTACT ROW (MINIMAL, NOT NAVIGATION) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mt-10 text-white/60"
        >
          <a
            href="#"
            className="hover:text-[#d8b88a] transition flex items-center gap-2 text-sm"
          >
            <FaInstagram size={16} /> Instagram
          </a>

          <a
            href="mailto:your@email.com"
            className="hover:text-[#d8b88a] transition flex items-center gap-2 text-sm"
          >
            <FaEnvelope size={16} /> Email
          </a>

          <a
            href="tel:+971000000000"
            className="hover:text-[#d8b88a] transition flex items-center gap-2 text-sm"
          >
            <FaPhone size={16} /> Call
          </a>
        </motion.div>

        {/* STATUS LINE */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-[#d8b88a]/70 text-xs tracking-[0.4em] uppercase"
        >
          Available Worldwide • Booking Open
        </motion.p>

        {/* COPYRIGHT */}
        <p className="mt-12 text-white/20 text-[10px] tracking-[0.3em]">
          © {new Date().getFullYear()} Demo Title — All Rights Reserved
        </p>

      </div>
    </footer>
  );
}