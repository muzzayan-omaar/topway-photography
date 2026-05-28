import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/971582469913"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="
        fixed
        bottom-6
        left-6
        z-50

        flex
        items-center
        justify-center

        w-14
        h-14

        rounded-full

        bg-black/40
        backdrop-blur-xl

        border
        border-[#d8b88a]/30

        shadow-[0_0_25px_rgba(216,184,138,0.25)]

        hover:scale-110
        transition-all
        duration-300
      "
    >
      {/* glow ring */}
      <span className="
        absolute
        w-full
        h-full
        rounded-full
        animate-ping
        bg-[#d8b88a]/20
      " />

      {/* icon */}
      <FaWhatsapp size={22} className="text-[#d8b88a] relative z-10" />
    </motion.a>
  );
}