"use client";

import React, { useEffect, useState, useId } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "motion/react";
import vynqeLogo from "../assets/vynqelogofull.svg";

/* -------------------------------------------------------------------------- */
/* SPARKLES CORE                                                              */
/* -------------------------------------------------------------------------- */
const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.2,
  speed = 2,
  particleColor = "#ffffff",
  particleDensity = 600,
}) => {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async () => {
    controls.start({ opacity: 1, transition: { duration: 1 } });
  };

  return (
    <motion.div
      animate={controls}
      className={`absolute inset-0 opacity-0 ${className}`}
    >
      {init && (
        <Particles
          id={id || generatedId}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background } },
            fullScreen: { enable: false },
            fpsLimit: 120,
            // --- ADDED INTERACTIVITY ---
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse", // Particles push away from cursor
                },
                onClick: {
                  enable: true,
                  mode: "push", // Adds more particles on click
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
                push: {
                  quantity: 4,
                },
              },
            },
            // --- END INTERACTIVITY ---
            particles: {
              number: {
                value: particleDensity,
                density: { enable: true, area: 800 },
              },
              color: { value: particleColor },
              shape: { type: "circle" },
              opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: {
                  enable: true,
                  speed,
                  sync: false,
                },
              },
              size: {
                value: { min: minSize, max: maxSize },
              },
              move: {
                enable: true,
                speed: { min: 0.1, max: 0.6 },
                direction: "none",
                outModes: { default: "out" },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* SEMI CIRCLE GLOW                                                           */
/* -------------------------------------------------------------------------- */
const SemiCircleGlow = ({ isPermissionGranted = false }) => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (!isPermissionGranted) return;

    let audioCtx, analyser, dataArray, source, rafId;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;

        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const boosted = Math.pow(avg / 128, 1.4);
          setAudioLevel((p) => p + (boosted - p) * 0.35);
          rafId = requestAnimationFrame(update);
        };
        update();
      } catch (_) {}
    };

    initAudio();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioCtx) audioCtx.close();
    };
  }, [isPermissionGranted]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div
        className="absolute left-1/2 bottom-[-520px] w-[1200px] h-[1200px] rounded-full blur-[160px]"
        style={{
          transform: `translateX(-50%) scale(${1 + audioLevel * 1.2})`,
          background: "rgba(30, 64, 175, 0.45)",
        }}
      />
      <div
        className="absolute left-1/2 bottom-[-400px] w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          transform: `translateX(-50%) scale(${1 + audioLevel * 1.6})`,
          background: "rgba(59, 130, 246, 0.6)",
        }}
      />
      <div
        className="absolute left-1/2 bottom-[-280px] w-[520px] h-[520px] rounded-full blur-[90px]"
        style={{
          transform: `translateX(-50%) scale(${1 + audioLevel * 2.2})`,
          background: "rgba(56, 189, 248, 0.7)",
        }}
      />
      <div
        className="absolute left-1/2 bottom-[-180px] w-[260px] h-[260px] rounded-full blur-[60px]"
        style={{
          transform: `translateX(-50%) scale(${1 + audioLevel * 3.2})`,
          opacity: 0.4 + audioLevel,
          background: "white",
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN ANIMATED BACKGROUND                                                   */
/* -------------------------------------------------------------------------- */
const AnimatedBackground = ({ isPermissionGranted = false }) => {
  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {/* 1. Glow Layer */}
      <div className="relative z-10 h-full w-full">
        <SemiCircleGlow isPermissionGranted={isPermissionGranted} />
      </div>

      {/* 2. Middle: Permanent floor glow */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_bottom,_rgba(30,64,175,0.2),_transparent_70%)] pointer-events-none" />

      {/* 3. Top: Sparkles (Pointer events ENABLED for interaction) */}
      <SparklesCore
        id="tsparticles-top"
        className="z-30 cursor-default" // Removed pointer-events-none
        particleColor="#ffffff"
        particleDensity={1200}
        speed={1.2}
        minSize={0.6}
        maxSize={1.4}
      />

      {/* 4. Overlay: Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center pointer-events-none z-[60]">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-white">
            Powered by
          </span>
          <img src={vynqeLogo} alt="vynqe" className="h-24 w-24 " />
        </div>
      </footer>
    </div>
  );
};

export default AnimatedBackground;