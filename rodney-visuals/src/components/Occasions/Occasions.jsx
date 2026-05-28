import { motion } from "framer-motion";
import { PartyPopper, Cake, Camera, Sparkles } from "lucide-react";

export default function Occasions() {
  const occasions = [
    {
      id: 1,
      icon: <PartyPopper size={22} />,
      title: "Weddings",
      desc: "Cinematic wedding storytelling capturing emotion, details, and timeless moments.",
    },
    {
      id: 2,
      icon: <Cake size={22} />,
      title: "Birthdays",
      desc: "Elegant event coverage that preserves energy, joy, and real celebration moments.",
    },
    {
      id: 3,
      icon: <Camera size={22} />,
      title: "Portraits",
      desc: "Professional solo & couple shoots with a cinematic editorial touch.",
    },
    {
      id: 4,
      icon: <Sparkles size={22} />,
      title: "Special Events",
      desc: "From engagements to private events — captured with storytelling precision.",
    },
  ];

  return (
    <section id="where" className="relative bg-[#080808] py-20">

      {/* centered container (NOT full width feel) */}
      <div className="max-w-5xl mx-auto px-6">

        {/* heading */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.35em] text-[#d8b88a] text-xs mb-2">
            Services
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light">
            Occasions Covered
          </h2>
        </div>

      {/* services grid */}
<div className="grid grid-cols-2 md:flex md:flex-row items-stretch gap-6 md:gap-0">

  {occasions.map((item, index) => (
    <div key={item.id} className="relative flex-1 px-3 md:px-6">

      {/* diagonal faded divider (desktop only) */}
      {index !== 0 && (
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-12" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
        className="text-center"
      >

        {/* icon */}
        <div className="text-[#d8b88a] flex justify-center mb-3">
          {item.icon}
        </div>

        {/* title */}
        <h3 className="font-serif text-lg md:text-xl text-white mb-2">
          {item.title}
        </h3>

        {/* desc */}
        <p className="text-white/50 text-[10px] md:text-xs leading-relaxed max-w-[160px] md:max-w-[220px] mx-auto">
          {item.desc}
        </p>

      </motion.div>
    </div>
  ))}

</div>

      </div>
    </section>
  );
}