"use client";

import { useEffect, useRef } from "react";

import { mountVoiceOrb, VOICE_ORB_RES, type VoiceState } from "@/lib/voice-orb-engine";

type VoiceOrbProps = {
  className?: string;
  state?: VoiceState;
  /** Simulate an active listening session for marketing display */
  demo?: boolean;
};

export function VoiceOrb({ className, state = "idle", demo = false }: VoiceOrbProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<ReturnType<typeof mountVoiceOrb> | null>(null);
  const demoFrameRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const orb = mountVoiceOrb(host, canvas, scaleRef.current);
    orbRef.current = orb;
    orb.start();

    return () => {
      orb.stop();
      orbRef.current = null;
    };
  }, []);

  useEffect(() => {
    orbRef.current?.setVoiceState(demo ? "listening" : state);
  }, [state, demo]);

  useEffect(() => {
    if (!demo) return;

    let raf = 0;
    const tick = () => {
      demoFrameRef.current += 1;
      const t = demoFrameRef.current;
      orbRef.current?.setMicLevel(0.28 + 0.22 * Math.sin(t * 0.032));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [demo]);

  return (
    <div ref={hostRef} className={`voice-orb voice-orb-host ${className ?? ""}`} aria-hidden="true">
      <div ref={scaleRef} className="voice-orb__scale" data-orb-scale>
        <canvas
          ref={canvasRef}
          className="voice-orb__canvas"
          width={VOICE_ORB_RES}
          height={VOICE_ORB_RES}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export type { VoiceState };
