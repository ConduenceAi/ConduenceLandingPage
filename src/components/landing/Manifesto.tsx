"use client";

import { motion } from "framer-motion";

/* ============================================================
   MANIFESTO — "Don't be a follower" + Traders → Bots → Agents
   ============================================================ */
export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden bg-white text-black px-section py-[clamp(3rem,7vw,7.5rem)]"
    >
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl mt-4 sm:mt-6 md:mt-10">
        {/* Leader not follower */}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-balance font-display text-[clamp(1.8rem,4.5vw+0.45rem,4.95rem)] uppercase leading-[0.9] tracking-[-0.03em]"
        >
          Don't be a follower,{" "}
          <span className="text-[0.8em] [word-spacing:0.18em] sm:whitespace-nowrap">
            <span className="font-display">Be the signal</span> others copy.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-body-fluid mt-6 max-w-2xl text-black/60 sm:mt-8"
        >
          Copy trading puts you behind the move. Conduence puts you at the front of it, Orchestrate
          the agents others end up watching.
        </motion.p>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12 sm:mt-16 md:mt-24"
        >
          <p className="text-display-medium font-display tracking-tight leading-[1.08]">
            <span className="block sm:whitespace-nowrap">
              Turn strategies into{" "}
              <span className="font-display text-black/70">fully independent autonomous</span>
            </span>
            <span className="block">
              market actors. <span className="text-black/40">No code.</span>
            </span>
          </p>

          <p className="text-display-medium mt-8 border-t border-black/10 pt-8 font-display tracking-tight leading-[1.08] sm:mt-10 sm:pt-10">
            Many strategies. <span className="font-display">One mind.</span>
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-body-fluid mt-6 max-w-2xl text-black/60 sm:mt-8"
        >
          Traders may not live forever, but how they trade will.
        </motion.p>
      </div>
    </section>
  );
}
