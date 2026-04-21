"use client";

import React, { useMemo, useState } from "react";
import { Squircle } from "@squircle-js/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Share2, ChevronRight, LogOut } from "lucide-react";
import heroBg from "../assets/herobg.gif";

// ── Action content map ────────────────────────────────────────
const CONTENT = {
  exit: {
    headline: "Some decisions deserve more than one visit.",
    sub: "We'll be here.",
    cta: "Keep Exploring",
  },
  next: {
    headline: "Curiosity is a good place to start.",
    sub: "There's more here worth your attention.",
    cta: "Keep Going",
  },
  rewatch: {
    headline: "Some things are worth a second pass.",
    sub: "The part that stood out is still there.",
    cta: "Watch Again",
  },
  share: {
    headline: "You know what this is worth.",
    sub: "The next step is probably not one you'd take alone.",
    cta: "Share with Your Team",
  },
};

const ACTION_META = {
  exit:    { label: "Exit",    Icon: LogOut      },
  rewatch: { label: "Rewatch", Icon: RotateCcw   },
  share:   { label: "Share",   Icon: Share2      },
  next:    { label: "Next",    Icon: ChevronRight },
};

function resolveAction(raw) {
  if (!raw) return "exit";
  const l = raw.toLowerCase();
  if (l.includes("next"))                              return "next";
  if (l.includes("rewatch") || l.includes("re-watch")) return "rewatch";
  if (l.includes("share"))                             return "share";
  return "exit";
}

// ── Animation variants ────────────────────────────────────────
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Hero image: stable, fills container fully ─────────────────
function HeroImage({ src }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {/* Shimmer placeholder — shown until image loads */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(110deg, #e8e4dc 30%, #ddd9cf 50%, #e8e4dc 70%)",
          backgroundSize: "200% 100%",
          animation: "na-shimmer 1.6s infinite linear",
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
      {/* Gradient overlay — always on top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.22) 100%)",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes na-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function NextAction({ prediction = null }) {
  const [clicked, setClicked] = useState(false);

  const action = resolveAction(prediction?.PredictedAction);
  const c      = CONTENT[action] ?? CONTENT.exit;
  const { label: actionLabel, Icon: ActionIcon } = ACTION_META[action] ?? ACTION_META.exit;

  const handleCtaClick = () => {
    if (clicked) return;
    setClicked(true);
    if (typeof gtag !== "undefined") {
      gtag("event", "next_action_cta_clicked", {
        cta_text:         c.cta,
        predicted_action: action,
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-3">
      {/* ── Main card ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Squircle
          cornerRadius={28}
          cornerSmoothing={1}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 20px 56px rgba(0,0,0,0.05)",
            padding: "12px",
          }}
        >
          {/*
            Layout strategy:
            • Mobile  (<lg): single column, image BELOW content,
                             image has a fixed aspect ratio so it
                             never collapses to 0 height.
            • Desktop (≥lg): two columns side-by-side.
                             Both children are stretch-aligned so
                             they always share the same height.
                             The image column uses position:absolute
                             to fill its grid cell completely.
          */}
          <div
            style={{
              display: "grid",
              gap: "12px",
              /* Mobile: single column */
              gridTemplateColumns: "1fr",
              gridTemplateRows: "auto",
            }}
            className="na-grid"
          >
            {/* LEFT — content panel */}
            <Squircle
              cornerRadius={20}
              cornerSmoothing={1}
              style={{
                background: "#F5F2EC",
                border: "1px solid rgba(0,0,0,0.04)",
                padding: "clamp(24px, 5vw, 36px)",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
              }}
            >
              {/* Top section — badge + headline + sub + divider */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}
              >
                {/* Action badge */}
                <motion.div variants={slideUp} style={{ marginBottom: 24 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#999",
                      background: "rgba(0,0,0,0.06)",
                      padding: "6px 12px",
                      borderRadius: 9999,
                    }}
                  >
                    <ActionIcon size={10} strokeWidth={2} />
                    {actionLabel}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  variants={slideUp}
                  style={{
                    fontSize: "clamp(20px, 3vw, 30px)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "#0f0f0f",
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  {c.headline}
                </motion.h2>

                {/* Sub */}
                <motion.p
                  variants={slideUp}
                  style={{
                    fontSize: "clamp(13px, 1.5vw, 15px)",
                    color: "#737373",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                >
                  {c.sub}
                </motion.p>

                <motion.div
                  variants={slideUp}
                  style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 24 }}
                />
              </motion.div>

              {/* CTA — always at bottom, never clipped */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.45, ease: "easeOut" }}
              >
                <motion.button
                  whileHover={!clicked ? { scale: 1.03 } : {}}
                  whileTap={!clicked ? { scale: 0.97 } : {}}
                  onClick={handleCtaClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "10px 20px",
                    borderRadius: 9999,
                    border: "none",
                    cursor: clicked ? "default" : "pointer",
                    transition: "background 0.2s, color 0.2s",
                    background: clicked ? "#e5e5e5" : "#0f0f0f",
                    color:      clicked ? "#aaa"    : "#fff",
                  }}
                >
                  {c.cta}
                  <ArrowRight size={13} />
                </motion.button>
              </motion.div>
            </Squircle>

            {/* RIGHT — hero image
                Mobile:  aspect-ratio box so it never collapses
                Desktop: stretches to match left panel via CSS grid align-items:stretch
            */}
            <Squircle
              cornerRadius={20}
              cornerSmoothing={1}
              style={{
                overflow: "hidden",
                position: "relative",
                /* Mobile fallback: fixed aspect ratio */
                aspectRatio: "16 / 9",
                minHeight: 0,
              }}
              className="na-hero-panel"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <HeroImage src={heroBg} />
              </motion.div>
            </Squircle>

          </div>
        </Squircle>
      </motion.div>

      {/* Post-click message */}
      <AnimatePresence>
        {clicked && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ fontSize: 13, color: "#a3a3a3", paddingLeft: 8 }}
          >
            Thanks for exploring — there's more waiting for you.
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Responsive grid styles ─────────────────────────────
          Keeping this in a <style> tag so it works with or without
          Tailwind JIT — no class-name generation issues.
      ────────────────────────────────────────────────────────── */}
      <style>{`
        /* Desktop: two columns, children stretch to same height */
        @media (min-width: 1024px) {
          .na-grid {
            grid-template-columns: 0.42fr 1fr !important;
            align-items: stretch;
          }
          /* On desktop the hero panel fills its cell via position:absolute children,
             so we must remove the aspect-ratio constraint and let the grid drive height */
          .na-hero-panel {
            aspect-ratio: unset !important;
            min-height: unset !important;
          }
        }

        /* Tablet: slightly taller aspect for the hero image */
        @media (min-width: 640px) and (max-width: 1023px) {
          .na-hero-panel {
            aspect-ratio: 21 / 9 !important;
          }
        }
      `}</style>
    </div>
  );
}