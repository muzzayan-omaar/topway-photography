import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Navbar() {

    const [showSubscribe, setShowSubscribe] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [email, setEmail] = useState("");
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        px-5
        md:px-8
        pt-5
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}

        <div>
          <h2
            className="
              text-white
              font-serif
              text-xl
              md:text-2xl
              tracking-tight
            "
          >
            Rodney{" "}
            <span className="signature-font text-[#d8b88a]">
              Visuals
            </span>
          </h2>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">
          {/* Subscribe Button */}

          <button
  onClick={() => {
  setShowSubscribe(!showSubscribe);
  setShowMenu(false);
}}
  className="
    flex
    items-center
    justify-center
    px-4 md:px-6
    py-3
    rounded-full
    cursor-pointer
    backdrop-blur-xl
    bg-white/10
    border
    border-white/15

    hover:bg-white/15

    transition-all
    duration-300

    shadow-[0_8px_30px_rgba(0,0,0,0.25)]
  "
>
  Subscribe
</button>

          {/* Menu Button */}

<button
  onClick={() => {
    setShowMenu(!showMenu);
    setShowSubscribe(false);
  }}
  className="
    w-12
    h-12
    flex
    cursor-pointer
    items-center
    justify-center
    rounded-full
    backdrop-blur-xl
    bg-white/10
    border
    border-white/15
    hover:bg-white/15
    transition-all
    duration-300
    shadow-[0_8px_30px_rgba(0,0,0,0.25)]
  "
>
<motion.div
  animate={{ rotate: showMenu ? 180 : 0 }}
  transition={{ duration: 0.25 }}
>
  {showMenu ? (
    <X size={18} />
  ) : (
    <Menu size={18} />
  )}
</motion.div>
</button>
        </div>
      </div>
      <AnimatePresence>
  {showSubscribe && (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="
        absolute
        top-24
        right-5 md:right-20
        w-[320px]
        max-w-[90vw]

        backdrop-blur-2xl
        bg-white/10

        border
        border-white/15

        rounded-3xl
        p-5

        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
      "
    >
      <p className="text-sm text-zinc-300 mb-4">
        Subscribe for new stories and projects.
      </p>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="
          w-full
          px-4
          py-3

          rounded-xl

          bg-black/20

          border
          border-white/10

          outline-none
        "
      />

      <button
        className="
          mt-4
          w-full
          py-3

          rounded-xl

          bg-[#d8b88a]
          text-black

          font-medium
        "
      >
        Join Newsletter
      </button>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {showMenu && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.2 }}
      className="
        absolute
        top-24
        right-5

        w-[340px]
        max-w-[92vw]

        backdrop-blur-2xl
        bg-white/10

        border
        border-white/15

        rounded-3xl

        p-6

        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
      "
    >
      <h3
        className="
          font-serif
          text-2xl
        "
      >
        Rodney{" "}
        <span className="signature-font text-[#d8b88a]">
          Visuals
        </span>
      </h3>

      <p
        className="
          mt-4
          text-sm
          text-zinc-300
          leading-relaxed
        "
      >
        Photographer, filmmaker and visual storyteller
        capturing authentic moments and timeless memories.
      </p>

      <div className="h-px bg-white/10 my-6" />

<div className="space-y-4">
  <a href="#" className="flex items-center gap-3">
    <FaInstagram />
    Instagram
  </a>

  <a href="#" className="flex items-center gap-3">
    <FaYoutube />
    YouTube
  </a>

  <a href="#" className="flex items-center gap-3">
    <FaWhatsapp />
    WhatsApp
  </a>
</div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.header>

    
  );
}