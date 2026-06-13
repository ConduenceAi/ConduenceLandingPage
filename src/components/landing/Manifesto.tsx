"use client";

import { motion } from "framer-motion";

/* ============================================================
   MANIFESTO — "Don't be a follower" + Traders → Bots → Agents
   ============================================================ */
export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-40 px-6">
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Leader not follower */}
        <p
          className="text-[10px] tracking-[0.4em] text-white/50 mb-8"
          style={{ fontFamily: '"Michroma", sans-serif' }}
        >
          [ MANIFESTO ]
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-balance font-black uppercase leading-[0.9] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
        >
          Don't be a follower.
          <br />
          <span className="italic font-light">Be the signal</span> others copy.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg text-white/60"
        >
          Copy-trading puts you behind the move. Conduence puts you at the front of it — orchestrate
          the agents others end up watching.
        </motion.p>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-24 max-w-4xl text-balance text-3xl sm:text-5xl font-black tracking-tight leading-[1.05]"
        >
          Turn your ideas into{" "}
          <span className="italic font-light text-white/70">fully independent</span> market actors.{" "}
          <span className="text-white/40">No code.</span>
        </motion.p>
      </div>
    </section>
  );
}
