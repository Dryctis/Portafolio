"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function TitleSweep({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <h1 className={"relative inline-block " + className}>
      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70">
        {text}
      </span>

      <motion.span
        aria-hidden
        className="absolute inset-0 z-20 pointer-events-none select-none bg-clip-text text-transparent mix-blend-screen font-inherit leading-[inherit]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)",
          backgroundSize: "200% 100%",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 35%, #000 65%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 35%, #000 65%, transparent 100%)",
          filter: "blur(10px)",
          opacity: 0.75,
        }}
        initial={{ backgroundPositionX: "-120%" }}
        animate={reduce ? { backgroundPositionX: "220%" } : { backgroundPositionX: ["-120%", "220%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      >
        {text}
      </motion.span>
    </h1>
  );
}
