"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Squircle } from "@squircle-js/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Target,
  Zap,
  ArrowRightCircle,
} from "lucide-react";

import kynosBg from "../../assets/kynosbg.gif";
import kynosVideo from "../../assets/kynosr.mp4";

const FEATURES = [
  {
    title: "Two-way Responsiveness",
    description: "Conversations that listen and respond — not broadcast. Nothing more.",
    icon: MessageSquare,
  },
  {
    title: "Intent Understanding",
    description: "It understands where the customer is without asking.",
    icon: Target,
  },
  {
    title: "Instantly Guided Readiness",
    description: "The right content, offer, or bundle — shown at the right moment.",
    icon: Zap,
  },
  {
    title: "Reduced Friction",
    description: "Clear steps. Faster decisions.",
    icon: ArrowRightCircle,
  },
];

const AUTO_PLAY_DURATION = 7000;

export default function Kynos() {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ hold-to-pause (mobile)
  const [isHolding, setIsHolding] = useState(false);

  // ✅ pause briefly after user taps a chip/step
  const isUserInteractingRef = useRef(false);

  // ✅ autoplay timer
  const timerRef = useRef(null);

  // autoplay using timeout (easier to pause/resume cleanly)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // pause on hold OR during interaction cooldown
    if (isHolding || isUserInteractingRef.current) return;

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, AUTO_PLAY_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isHolding]);

  const setActive = (idx) => {
    isUserInteractingRef.current = true;
    setActiveIndex(idx);

    window.setTimeout(() => {
      isUserInteractingRef.current = false;
      // kick autoplay forward again after cooldown
      setActiveIndex((x) => x);
    }, 1400);
  };

  const activeFeature = useMemo(() => FEATURES[activeIndex], [activeIndex]);

  // ✅ hold handlers (mouse + touch)
  const holdHandlers = {
    onPointerDown: () => setIsHolding(true),
    onPointerUp: () => setIsHolding(false),
    onPointerCancel: () => setIsHolding(false),
    onPointerLeave: () => setIsHolding(false),
  };

  return (
    <section
      id="interface"
      className="relative min-h-screen dark-section overflow-hidden bg-black"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kynosBg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-14 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="min-w-0">
            {/* Eyebrow */}
           

            {/* Title */}
            <h2
              className="
                font-decog mt-5 text-white tracking-wide
                text-[clamp(28px,4.5vw,48px)]
                leading-[1.1]
              "
            >
Guided 3-Way Interfaces for Decision Readiness
  </h2>

            {/* Subtitle */}
            <p className="mt-4 text-white/70 text-[15px] sm:text-[16px] md:text-lg max-w-xl font-light leading-relaxed">
             It is vynqe’s first live product built to help businesses guide customer decisions through intelligent, Three-way communication. It works quietly in the background, while users experience clarity and continuity. 
            </p>

            {/* MOBILE */}
            <div className="mt-8 lg:hidden">
              <Squircle
                cornerRadius={22}
                cornerSmoothing={1}
                as="div"
                className="border border-white/10 bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 select-none"
                {...holdHandlers}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 flex items-center justify-center">
                      {(() => {
                        const Icon = activeFeature.icon;
                        return <Icon size={18} className="text-white/85" />;
                      })()}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-white text-[15px] font-medium tracking-tight">
                      {activeFeature.title}
                    </div>
                    <div className="mt-1 text-white/60 text-[13px] leading-relaxed font-light">
                      {activeFeature.description}
                    </div>
                  </div>
                </div>

                {/* Mobile chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {FEATURES.map((f, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={f.title}
                        type="button"
                        onClick={() => setActive(idx)}
                        className={[
                          "px-3 py-1.5 rounded-full text-[12px] transition-colors",
                          "border ring-1 ring-white/5",
                          isActive
                            ? "bg-[#FFCC33]/15 border-[#FFCC33]/40 text-white"
                            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/8",
                        ].join(" ")}
                        aria-pressed={isActive}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Progress bar (CSS so we can PAUSE on hold) */}
                <div className="mt-4 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    key={activeIndex} // restart fill when step changes
                    className="h-full bg-[#FFCC33] shadow-[0_0_12px_rgba(255,204,51,0.7)] kynos-progress"
                    style={{
                      animationDuration: `${AUTO_PLAY_DURATION}ms`,
                      animationPlayState: isHolding ? "paused" : "running",
                    }}
                  />
                </div>
              </Squircle>

              <style>{`
                @keyframes kynosProgressFill {
                  from { width: 0%; }
                  to   { width: 100%; }
                }
                .kynos-progress {
                  width: 0%;
                  animation-name: kynosProgressFill;
                  animation-timing-function: linear;
                  animation-fill-mode: forwards;
                }
              `}</style>
            </div>

            {/* DESKTOP */}
            <div className="mt-10 hidden lg:block">
              <div className="relative flex flex-col gap-10 pl-2">
                {FEATURES.map((feature, index) => {
                  const isActive = activeIndex === index;
                  const isPast = index < activeIndex;
                  const Icon = feature.icon;

                  return (
                    <button
                      key={feature.title}
                      type="button"
                      onClick={() => setActive(index)}
                      className="relative pl-16 text-left outline-none group"
                    >
                      {/* Progress line between items */}
                      {index < FEATURES.length - 1 && (
                        <div className="absolute left-[22px] top-[44px] bottom-[-40px] w-px overflow-hidden">
                          {isActive && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{
                                duration: AUTO_PLAY_DURATION / 1000,
                                ease: "linear",
                              }}
                              className="w-full bg-white"
                            />
                          )}
                          {isPast && <div className="w-full h-full bg-white/40" />}
                        </div>
                      )}

                      {/* Icon */}
                      <div className="absolute left-0 top-0 z-10">
                        <motion.div
                          animate={{
                            scale: isActive ? 1.05 : 1,
                            backgroundColor: isActive ? "#111" : "#0b0b0b",
                            borderColor: isActive
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(255,255,255,0.12)",
                          }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="w-[44px] h-[44px] rounded-full border flex items-center justify-center"
                        >
                          <Icon
                            size={17}
                            className={isActive ? "text-white" : "text-white/35"}
                          />
                        </motion.div>
                      </div>

                      {/* Text */}
                      <motion.div
                        animate={{
                          opacity: isActive ? 1 : 0.45,
                          x: isActive ? 8 : 0,
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="min-w-0"
                      >
                        <div className="text-[17px] font-medium tracking-tight text-white">
                          {feature.title}
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-2 text-white/55 text-[15px] font-light leading-relaxed max-w-md overflow-hidden"
                            >
                              {feature.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full max-w-[520px] lg:max-w-none mx-auto">
            <Squircle
              cornerRadius={56}
              cornerSmoothing={1}
              as="div"
              className="relative aspect-[4/5] sm:aspect-[16/18] lg:aspect-[4/5] w-full overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_40px_100px_rgba(0,0,0,0.60)]"
            >
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                src={kynosVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/65 via-transparent to-white/5" />
            </Squircle>
          </div>
        </div>
      </div>
    </section>
  );
}
