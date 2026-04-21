"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback, useId } from "react";

import { Squircle } from "@squircle-js/react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, ChevronRight, Zap,
  ArrowRight, Phone, ArrowUpRight, Home,
} from "lucide-react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { industries } from "../utils/democontent";
import { tracker }    from "../utils/engagementTracker";
import { useSession, getSession, setPrediction, setPhone as persistPhoneToSession } from "../utils/session";
import { logSession, updatePhone } from "../utils/sheetsLogger";
import NextAction from "../components/NextAction";

// ── Microsite SVGs ────────────────────────────────────────────
import mc1 from "../assets/demo/svgs/mc1.svg";
import mc2 from "../assets/demo/svgs/mc2.svg";
import mc3 from "../assets/demo/svgs/mc3.svg";
import mc4 from "../assets/demo/svgs/mc4.svg";
import mc5 from "../assets/demo/svgs/mc5.svg";
import mc6 from "../assets/demo/svgs/mc6.svg";

// ── Ecommerce SVGs ────────────────────────────────────────────
import ec1svg from "../assets/demo/svgs/ec1.svg";
import ec2svg from "../assets/demo/svgs/ec2.svg";
import ec3svg from "../assets/demo/svgs/ec3.svg";
import ec4svg from "../assets/demo/svgs/ec4.svg";
import ec5svg from "../assets/demo/svgs/ec5.svg";
import ec6svg from "../assets/demo/svgs/ec6.svg";

// ── Microsite GIFs ────────────────────────────────────────────
import mc1gif from "../assets/demo/gifs/mc1.gif";
import mc2gif from "../assets/demo/gifs/mc2.gif";
import mc3gif from "../assets/demo/gifs/mc3.gif";
import mc4gif from "../assets/demo/gifs/mc4.gif";
import mc5gif from "../assets/demo/gifs/mc5.gif";
import mc6gif from "../assets/demo/gifs/mc6.gif";

// ── Ecommerce GIFs ────────────────────────────────────────────
import ec1gif from "../assets/demo/gifs/ec1.gif";
import ec2gif from "../assets/demo/gifs/ec2.gif";
import ec3gif from "../assets/demo/gifs/ec3.gif";
import ec4gif from "../assets/demo/gifs/ec4.gif";
import ec5gif from "../assets/demo/gifs/ec5.gif";
import ec6gif from "../assets/demo/gifs/ec6.gif";

// ── Microsite videos ──────────────────────────────────────────
import mc1vid from "../assets/demo/videos/mc1.mp4";
import mc2vid from "../assets/demo/videos/mc2.mp4";
import mc3vid from "../assets/demo/videos/mc3.mp4";
import mc4vid from "../assets/demo/videos/mc4.mp4";
import mc5vid from "../assets/demo/videos/mc5.mp4";
import mc6vid from "../assets/demo/videos/mc6.mp4";

// ── Ecommerce videos ──────────────────────────────────────────
import ec1vid from "../assets/demo/videos/ec1.mp4";
import ec2vid from "../assets/demo/videos/ec2.mp4";
import ec3vid from "../assets/demo/videos/ec3.mp4";
import ec4vid from "../assets/demo/videos/ec4.mp4";
import ec5vid from "../assets/demo/videos/ec5.mp4";
import ec6vid from "../assets/demo/videos/ec6.mp4";

import VynqeLogoFull from "../assets/vynqelogofull.svg";

const IMAGE_MAP = {
  "ms-1": mc1,    "ms-2": mc2,    "ms-3": mc3,
  "ms-4": mc4,    "ms-5": mc5,    "ms-6": mc6,
  "ec-1": ec1svg, "ec-2": ec2svg, "ec-3": ec3svg,
  "ec-4": ec4svg, "ec-5": ec5svg, "ec-6": ec6svg,
};

const GIF_MAP = {
  "ms-1": mc1gif, "ms-2": mc2gif, "ms-3": mc3gif,
  "ms-4": mc4gif, "ms-5": mc5gif, "ms-6": mc6gif,
  "ec-1": ec1gif, "ec-2": ec2gif, "ec-3": ec3gif,
  "ec-4": ec4gif, "ec-5": ec5gif, "ec-6": ec6gif,
};

const VIDEO_MAP = {
  "ms-1": mc1vid, "ms-2": mc2vid, "ms-3": mc3vid,
  "ms-4": mc4vid, "ms-5": mc5vid, "ms-6": mc6vid,
  "ec-1": ec1vid, "ec-2": ec2vid, "ec-3": ec3vid,
  "ec-4": ec4vid, "ec-5": ec5vid, "ec-6": ec6vid,
};

// ── API config ────────────────────────────────────────────────
const API_BASE   = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001";
const P2_WAIT_MS = 600;
const CONTROLS_H = 64;
const CARD_H     = 560;

const INDUSTRY_COLORS = {
  microsites: { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  ecommerce:  { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
};

const TOWER_CSS = `
  .vynqe-loader{scale:3;height:50px;width:40px}
  .vynqe-box{position:relative;opacity:0;left:10px}

  /* GOLD / YELLOW THEME */
  .vynqe-side-left{
    position:absolute;
    background-color:#E6A800; /* darker gold */
    width:19px;height:5px;
    transform:skew(0deg,-25deg);
    top:14px;left:10px
  }

  .vynqe-side-right{
    position:absolute;
    background-color:#FFC933; /* mid yellow */
    width:19px;height:5px;
    transform:skew(0deg,25deg);
    top:14px;left:-9px
  }

  .vynqe-side-top{
    position:absolute;
    background-color:#FFE8A3; /* light highlight */
    width:20px;height:20px;
    rotate:45deg;
    transform:skew(-20deg,-20deg)
  }

  .vynqe-box-1{animation:vynqe-left 4s infinite}
  .vynqe-box-2{animation:vynqe-right 4s infinite;animation-delay:1s}
  .vynqe-box-3{animation:vynqe-left 4s infinite;animation-delay:2s}
  .vynqe-box-4{animation:vynqe-right 4s infinite;animation-delay:3s}

  @keyframes vynqe-left{
    0%{z-index:20;opacity:0;translate:-20px -6px}
    20%{z-index:10;opacity:1;translate:0px 0px}
    40%{z-index:9;translate:0px 4px}
    60%{z-index:8;translate:0px 8px}
    80%{z-index:7;opacity:1;translate:0px 12px}
    100%{z-index:5;translate:0px 30px;opacity:0}
  }

  @keyframes vynqe-right{
    0%{z-index:20;opacity:0;translate:20px -6px}
    20%{z-index:10;opacity:1;translate:0px 0px}
    40%{z-index:9;translate:0px 4px}
    60%{z-index:8;translate:0px 8px}
    80%{z-index:7;opacity:1;translate:0px 12px}
    100%{z-index:5;translate:0px 30px;opacity:0}
  }
`;

function injectTowerCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById("vynqe-tower-css")) return;
  const el = document.createElement("style");
  el.id = "vynqe-tower-css";
  el.textContent = TOWER_CSS;
  document.head.appendChild(el);
}

function TowerLoader() {
  useEffect(() => { injectTowerCSS(); }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div className="vynqe-loader">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`vynqe-box vynqe-box-${n}`}>
            <div className="vynqe-side-left" />
            <div className="vynqe-side-right" />
            <div className="vynqe-side-top" />
          </div>
        ))}
      </div>
      <p className="text-[13px] text-neutral-400 tracking-wide mt-4">Crafting your session…</p>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function findProductById(id) {
  for (const ind of industries) {
    for (const p of ind.products) {
      if (p.id === id) return { ...p, industryName: ind.name, industryId: ind.id };
    }
  }
  return null;
}

function computeChurnRisk(engagementScore, timeSpentSeconds) {
  if (timeSpentSeconds < 20 && engagementScore < 0.4) return 0.9;
  if (engagementScore >= 0.65 && timeSpentSeconds >= 45) return 0.2;
  if (engagementScore >= 0.5 || timeSpentSeconds >= 30) return 0.4;
  return 0.7;
}

/* ══════════════════════════════════════
   SPARKLES (from DemoEnd)
══════════════════════════════════════ */
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
    <motion.div animate={controls} className={`absolute inset-0 opacity-0 ${className}`}>
      {init && (
        <Particles
          id={id || generatedId}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background } },
            fullScreen: { enable: false },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { quantity: 4 },
              },
            },
            particles: {
              number: { value: particleDensity, density: { enable: true, area: 800 } },
              color: { value: particleColor },
              shape: { type: "circle" },
              opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: { enable: true, speed, sync: false },
              },
              size: { value: { min: minSize, max: maxSize } },
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

/* ══════════════════════════════════════
   PHONE CTA — replaces DemoEnd form
══════════════════════════════════════ */
function PhoneCTA({ session }) {
  const [phone, setPhoneInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!phone.trim() || submitting) return;

    setSubmitting(true);

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "call_requested", { phone });
    }

    persistPhoneToSession(phone.trim());
    const sess = getSession();

    // Only update phone if session exists (prevents orphaned records)
    if (sess.sessionId) {
      const res = updatePhone(sess);
      if (res?.catch) {
        res.catch(() => {});
      }
    } else {
      console.warn("[PhoneCTA] No sessionId found - phone stored locally only");
    }

    const demoEndUrl = import.meta.env.VITE_FORMSPREE_DEMO_END;
    if (demoEndUrl) {
      fetch(demoEndUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          phone,
          fullName:    sess.fullName    || sess.name || "",
          email:       sess.email       || "",
          company:     sess.company     || "",
          jobTitle:    sess.jobTitle    || "",
          industry:    sess.industry    || "",
          accountType: sess.accountType || "",
          message:     sess.message     || "",
          user_id:     sess.userId      || "",
          session_id:  sess.sessionId   || "",
        }),
      }).catch(() => {});
    }

    // Show spinner for 1 second then redirect home
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-5 pt-10 pb-4"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="font-semibold text-[clamp(22px,4vw,42px)] leading-[1.1] text-white max-w-xs sm:max-w-lg px-2"
      >
        You've seen what's possible.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.68, ease: "easeOut" }}
        className="text-[13px] sm:text-[15px] leading-relaxed text-white/75 max-w-[260px] sm:max-w-sm"
      >
        The interesting part is what happens next.
        Drop your number — let's talk through it.
      </motion.p>

      <AnimatePresence mode="wait">
        {!submitting ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.78, ease: "easeOut" }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center w-full max-w-[300px] sm:max-w-[340px]">
              {/* Input — left pill */}
              <div className="flex items-center gap-2 flex-1
                bg-white/15
                border border-white/35
                border-r-0
                rounded-l-full
                px-4 py-[10px] sm:py-[11px]
                backdrop-blur-md
                focus-within:bg-white/22
                focus-within:border-white/55
                transition-all duration-300"
              >
                <Phone size={13} className="text-white/55 flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Your number"
                  className="bg-transparent text-white text-[13px] placeholder-white/45 outline-none w-full min-w-0"
                />
              </div>

              {/* CTA — right pill */}
              <button
                onClick={handleSubmit}
                className="group inline-flex items-center gap-1.5 pl-4 pr-2 py-[9px] sm:py-[10px] rounded-r-full text-[11px] font-semibold uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-xl transition-all duration-300 hover:-translate-y-[1px] whitespace-nowrap flex-shrink-0"
              >
                Get a Call
                <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight size={11} className="group-hover:rotate-45 transition-transform" />
                </span>
              </button>
            </div>

            <p className="text-[11px] text-white/50">
              Usually within one business day.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="spinner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 py-2"
          >
            {/* Spinner */}
            <svg
              className="animate-spin"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14" cy="14" r="11"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2.5"
              />
              <path
                d="M14 3 A11 11 0 0 1 25 14"
                stroke="#FFCC33"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-[12px] text-white/50 tracking-wide">On our way…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   P3 VIDEO PLAYER
══════════════════════════════════════ */
function P3VideoPlayer({ productId }) {
  const videoRef    = useRef(null);
  const progressRef = useRef(null);
  const rafRef      = useRef(null);

  const [playing, setPlaying]         = useState(false);
  const [muted, setMuted]             = useState(true);
  const [progress, setProgress]       = useState(0);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loaded, setLoaded]           = useState(false);

  const videoSrc = VIDEO_MAP[productId] ?? null;

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const tick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    setProgress((vid.currentTime / (vid.duration || 1)) * 100);
    if (!vid.paused && !vid.ended) rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleTogglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) {
      vid.pause();
      cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      vid.play().catch(() => {});
      rafRef.current = requestAnimationFrame(tick);
      setPlaying(true);
    }
  }, [playing, tick]);

  const handleMuteToggle = useCallback((e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(m => !m);
  }, [muted]);

  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    const bar = progressRef.current;
    if (!vid || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = pct * (vid.duration || 0);
    setProgress(pct * 100);
    setCurrentTime(vid.currentTime);
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const videoAreaH = CARD_H - CONTROLS_H;

  return (
    <div
      className="flex flex-col select-none"
      style={{ width: "100%", height: CARD_H, background: "#0a0a0a" }}
    >
      <div
        className="relative cursor-pointer overflow-hidden group flex-1"
        style={{ height: videoAreaH, flexShrink: 0 }}
        onClick={handleTogglePlay}
      >
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

        {videoSrc ? (
          <>
            {!loaded && (
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:     "linear-gradient(90deg, #111 0%, #1c1c1c 50%, #111 100%)",
                  backgroundSize: "200% 100%",
                  animation:      "shimmer 1.4s infinite",
                }}
              />
            )}
            <video
              key={productId}
              ref={videoRef}
              src={videoSrc}
              muted={muted}
              preload="auto"
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#0a0a0a" }}
              onLoadedMetadata={() => { setDuration(videoRef.current?.duration || 0); setLoaded(true); }}
              onCanPlay={() => setLoaded(true)}
              onEnded={() => {
                setPlaying(false); setProgress(0); setCurrentTime(0);
                cancelAnimationFrame(rafRef.current);
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm"
            style={{ background: "#111" }}>
            Video unavailable
          </div>
        )}

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{ pointerEvents: "auto" }}
            className="h-14 w-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-transform active:scale-95"
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </div>
        </div>
      </div>

      <div
        style={{ height: CONTROLS_H, flexShrink: 0, background: "#111111" }}
        className="flex flex-col justify-center gap-2.5 px-5"
      >
        <div
          ref={progressRef}
          className="w-full h-[16px] flex items-center cursor-pointer group/bar"
          onClick={handleSeek}
        >
          <div className="relative w-full h-[3px] rounded-full" style={{ background: "#2a2a2a" }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${progress}%`, background: "rgba(255,255,255,0.85)", transition: "width 0.08s linear" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[11px] w-[11px] rounded-full bg-white shadow opacity-0 group-hover/bar:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: "-5.5px" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={handleTogglePlay}
              className="h-7 w-7 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
            </button>
            <button onClick={handleMuteToggle}
              className="h-7 w-7 rounded-full flex items-center justify-center text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <span className="text-[11px] text-neutral-500 tabular-nums">
              {fmt(currentTime)}<span className="text-neutral-700 mx-1">/</span>{fmt(duration)}
            </span>
          </div>
          <span className="text-[10px] tracking-[0.14em] text-neutral-600 uppercase">Walkthrough</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   PRODUCT INFO PANEL
══════════════════════════════════════ */
function ProductInfoPanel({ product, nextProductId }) {
  if (!product) return null;

  const gif   = GIF_MAP[nextProductId]   ?? null;
  const image = IMAGE_MAP[nextProductId] ?? null;

  const industryId   = product.industryId   ?? "microsites";
  const industryName = product.industryName ?? "Microsites";
  const badgeColor   = INDUSTRY_COLORS[industryId] ?? INDUSTRY_COLORS.microsites;

  const l1 = product.level1 ?? {};
  const l2 = product.level2 ?? {};
  const l3 = product.level3 ?? {};

  const outcomes  = l3.whatWeSolve ?? null;
  const output    = l3.output      ?? null;
  const IMG_AREA_H = 160;

  return (
    <div className="flex flex-col" style={{ height: CARD_H, overflow: "hidden" }}>
      <div
        className="relative flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          height:       IMG_AREA_H,
          background:   "linear-gradient(135deg, #FAFAF9 0%, #F3F2EF 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize:  "18px 18px",
          }}
        />
        {gif ? (
          <motion.img key={nextProductId + "-gif"} src={gif} alt={l1.title ?? ""}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }} className="relative z-10"
            style={{ maxHeight: IMG_AREA_H - 24, maxWidth: "80%", width: "auto", objectFit: "contain", display: "block" }}
          />
        ) : image ? (
          <motion.img key={nextProductId + "-img"} src={image} alt={l1.title ?? ""}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }} className="relative z-10"
            style={{ maxHeight: IMG_AREA_H - 24, maxWidth: "72%", width: "auto", objectFit: "contain", display: "block" }}
          />
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
            <Zap size={22} className="text-neutral-300" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <style>{`.p3-scroll::-webkit-scrollbar{display:none}`}</style>
        <div className="flex flex-col gap-5 p-5 sm:p-6 p3-scroll">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }} className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase"
              style={{ background: badgeColor.bg, color: badgeColor.text }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: badgeColor.dot }} />
              {industryName}
            </span>
            <h3 className="text-[19px] sm:text-[21px] font-semibold text-[#0f0f0f] leading-[1.25] tracking-[-0.02em]">
              {l1.title}
            </h3>
            {l2.subtitle && (
              <p className="text-[11px] text-neutral-400 uppercase tracking-[0.07em] leading-relaxed">
                {l2.subtitle}
              </p>
            )}
          </motion.div>

          {l2.description && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.13, ease: "easeOut" }}
              className="text-[13px] text-neutral-600 leading-[1.7]">
              {l2.description}
            </motion.p>
          )}

          {l2.howItWorks && l2.howItWorks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.17, ease: "easeOut" }} className="flex flex-col gap-2">
              {l2.howItWorks.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-[6px] h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: "#c8c8c8" }} />
                  <span className="text-[12.5px] text-neutral-600 leading-relaxed">{point}</span>
                </div>
              ))}
            </motion.div>
          )}

          {output?.summary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.21, ease: "easeOut" }}
              className="rounded-2xl p-4 flex gap-3 items-start"
              style={{ background: "linear-gradient(135deg, #F8F7F5 0%, #F1EFEB 100%)", border: "1px solid rgba(0,0,0,0.07)" }}>
              <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: "#E5E3DE" }}>
                <ArrowRight size={9} className="text-neutral-500" />
              </div>
              <p className="text-[12.5px] text-neutral-700 leading-[1.65]">{output.summary}</p>
            </motion.div>
          )}

          {outcomes?.points && outcomes.points.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26, ease: "easeOut" }} className="flex flex-col gap-2 pb-2">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.12em]">
                {outcomes.heading ?? "Outcomes"}
              </p>
              <div className="flex flex-wrap gap-2">
                {outcomes.points.slice(0, 3).map((pt, i) => (
                  <span key={i} className="rounded-full px-3 py-1 text-[11px] text-neutral-600 leading-snug"
                    style={{ background: "#EFEDE9", border: "1px solid #E3E0DB" }}>
                    {pt}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function Personalisation3({
  bestProductId         = null,
  hoverTopProductId     = null,
  hoverTimeSpentSeconds = 0,
  onPrediction,
}) {
  const session = useSession();

  const [modelResult, setModelResult]     = useState(null);
  const [loading, setLoading]             = useState(false);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const [error, setError]                 = useState(null);

  const hasFired      = useRef(false);
  const pendingFire   = useRef(false);
  const waitTimerRef  = useRef(null);
  const sectionRef    = useRef(null);
  const apiResultRef  = useRef(null);
  const minTimerRef   = useRef(null);
  const minTimerDone  = useRef(false);

  const lastModelRequestRef = useRef(null);

  const bestProductIdRef         = useRef(bestProductId);
  const hoverTopProductIdRef     = useRef(hoverTopProductId);
  const hoverTimeSpentSecondsRef = useRef(hoverTimeSpentSeconds);
  const sessionRef               = useRef(session);

  useEffect(() => { bestProductIdRef.current         = bestProductId;         }, [bestProductId]);
  useEffect(() => { hoverTopProductIdRef.current     = hoverTopProductId;     }, [hoverTopProductId]);
  useEffect(() => { hoverTimeSpentSecondsRef.current = hoverTimeSpentSeconds; }, [hoverTimeSpentSeconds]);
  useEffect(() => { sessionRef.current               = session;               }, [session]);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasFired.current) return;
      if (!hoverTopProductIdRef.current) { pendingFire.current = true; return; }
      waitTimerRef.current = setTimeout(() => {
        waitTimerRef.current = null;
        if (!hasFired.current) { hasFired.current = true; fireModel(); }
      }, P2_WAIT_MS);
    }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => {
      obs.disconnect();
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!bestProductId || hasFired.current) return;
    if (waitTimerRef.current !== null) {
      clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
      hasFired.current = true;
      fireModel();
    }
  }, [bestProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hoverTopProductId || hasFired.current || !pendingFire.current) return;
    pendingFire.current = false;
    waitTimerRef.current = setTimeout(() => {
      waitTimerRef.current = null;
      if (!hasFired.current) { hasFired.current = true; fireModel(); }
    }, P2_WAIT_MS);
  }, [hoverTopProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    if (minTimerRef.current)  clearTimeout(minTimerRef.current);
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
  }, []);

  const fireModel = () => {
    tracker.finalizeTotalPageTime();

    const engagementScore  = tracker.getScore();
    const topProductId     = bestProductIdRef.current || hoverTopProductIdRef.current || null;
    const timeSpentSeconds = hoverTimeSpentSecondsRef.current || 0;
    const normalizedTimeSpentSeconds = Math.max(timeSpentSeconds, 45);
    const normalizedEngagementScore  = Math.max(engagementScore, 0.5);
    const churnRisk = computeChurnRisk(normalizedEngagementScore, normalizedTimeSpentSeconds);

    const sess        = sessionRef.current;
    const accountType = sess?.accountType || "Customer";
    const industry    = sess?.industry    || "Retail & E-commerce";
    const deviceType  = sess?.deviceType  || "Desktop";

    const payload = {
      UserID:           getSession().userId || getSession().sessionId || "unknown",
      ProductID:        topProductId,
      TimeSpentSeconds: normalizedTimeSpentSeconds,
      EngagementScore:  normalizedEngagementScore,
      ChurnRisk:        churnRisk,
      AccountType:      accountType,
      Industry:         industry,
      DeviceType:       deviceType,
      FormSubmit:       !!sess?.formSubmitted,
    };

    lastModelRequestRef.current = payload;

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "model_call_fired", {
        product_id:       topProductId,
        time_spent:       timeSpentSeconds,
        engagement_score: engagementScore,
        account_type:     accountType,
        industry,
      });
    }

    setLoading(true);
    minTimerDone.current = false;
    apiResultRef.current = null;

    minTimerRef.current = setTimeout(() => {
      minTimerDone.current = true;
      if (apiResultRef.current !== null) {
        setModelResult(apiResultRef.current);
        setLoading(false);
        setReadyToReveal(true);
        if (onPrediction) onPrediction(apiResultRef.current);
      }
    }, 3000);

    fetch(`${API_BASE}/predict_action`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} from ${API_BASE}`);
        return r.json();
      })
      .then(data => {
        // Update session with prediction (creates sessionId if needed)
        const updatedSession = setPrediction(data);

        // Log session with complete data (including newly created sessionId)
        logSession(
          updatedSession,
          tracker,
          lastModelRequestRef.current,
          data,
        ).catch(() => {});

        if (minTimerDone.current) {
          setModelResult(data);
          setLoading(false);
          setReadyToReveal(true);
          if (onPrediction) onPrediction(data);
        } else {
          apiResultRef.current = data;
        }
      })
      .catch((err) => {
        if (minTimerRef.current) clearTimeout(minTimerRef.current);

        // Even on error, ensure session exists and log it
        const currentSession = sessionRef.current || getSession();
        if (!currentSession.sessionId) {
          // Force session creation even on error
          const updatedSession = setPrediction({ prediction: { PredictedAction: "Error", ActionConfidence: 0 } });
          logSession(
            updatedSession,
            tracker,
            lastModelRequestRef.current,
            null,
          ).catch(() => {});
        } else {
          logSession(
            currentSession,
            tracker,
            lastModelRequestRef.current,
            null,
          ).catch(() => {});
        }

        setError(err.message);
        setLoading(false);
      });
  };

  const predictedAction = modelResult?.prediction?.PredictedAction ?? null;
  const nextProductId   = modelResult?.prediction?.NextProductID   ?? null;

  const nextProductObj = useMemo(
    () => (nextProductId ? findProductById(nextProductId) : null),
    [nextProductId]
  );

  const isNextProduct = predictedAction === "Next Product";

  // ── Shard count for the DemoEnd-style background ──────────────
  const shards = Array.from({ length: 20 });

  return (
    <section
      ref={sectionRef}
      id="p3"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── SHARD BACKGROUND (from DemoEnd) ──────────────────── */}
      <div className="absolute inset-0 flex z-0">
        {shards.map((_, i) => (
          <div
            key={i}
            className="h-full flex-1 relative"
            style={{
              background:     "linear-gradient(to top, #062f88, #1e3a8a, #000000)",
              backgroundSize: "100% 200%",
              filter:         `brightness(${1.9 + i * 0.09})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:   "linear-gradient(to right, rgba(255,255,255,0.05), transparent)",
                mixBlendMode: "overlay",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── SPARKLES ──────────────────────────────────────────── */}
      <SparklesCore
        className="z-10"
        particleDensity={4000}
        minSize={0.5}
        maxSize={1.3}
        speed={1.5}
        particleColor="#ffffff"
      />

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <div className="relative z-20 w-full flex flex-col items-center px-4 sm:px-6 py-16 sm:py-24 gap-6">
        <AnimatePresence mode="wait">

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full">
              <TowerLoader />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="w-full max-w-7xl">
              <NextAction prediction={null} sessionProfile={session} />
              <PhoneCTA session={session} />
            </motion.div>
          )}

          {!loading && !error && readyToReveal && isNextProduct && nextProductObj && (
            <motion.div key="next-product" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-7xl flex flex-col gap-5">

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }} className="flex items-center gap-2">
                <ChevronRight size={12} className="text-white/40" />
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/40 font-medium">
                  Recommended for you
                </span>
              </motion.div>

              <Squircle cornerRadius={28} cornerSmoothing={1} className="overflow-hidden"
                style={{ background: "#fff", border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 72px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)" }}>
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]" style={{ height: CARD_H }}>
                  <div className="overflow-hidden" style={{ height: CARD_H, borderRight: "1px solid rgba(0,0,0,0.06)" }}>
                    <P3VideoPlayer productId={nextProductId} />
                  </div>
                  <div style={{ height: CARD_H, overflow: "hidden" }}>
                    <ProductInfoPanel product={nextProductObj} nextProductId={nextProductId} />
                  </div>
                </div>
              </Squircle>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <NextAction prediction={modelResult?.prediction} sessionProfile={session} />
              </motion.div>

              {/* ── Phone CTA below NextAction ── */}
              <PhoneCTA session={session} />

            </motion.div>
          )}

          {!loading && !error && readyToReveal && !isNextProduct && modelResult && (
            <motion.div key="next-action" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-7xl flex flex-col gap-0">
              <NextAction prediction={modelResult?.prediction} sessionProfile={session} />
              {/* ── Phone CTA below NextAction ── */}
              <PhoneCTA session={session} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── FOOTER LOGO ───────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 text-white text-[14px] z-30 whitespace-nowrap pointer-events-none">
        <span>Powered by</span>
        <img src={VynqeLogoFull} alt="Vynqe" className="h-5 sm:h-6 " />
      </div>

      <style>{`
        @keyframes vynqeGradMove {
          0%   { background-position: 0% 100%; }
          50%  { background-position: 0% 0%;   }
          100% { background-position: 0% 100%; }
        }
      `}</style>
    </section>
  );
}