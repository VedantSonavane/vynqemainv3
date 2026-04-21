"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { BrainCircuit, Pointer, ScanFace, Zap, ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Squircle } from "@squircle-js/react";
import { motion, LayoutGroup } from "framer-motion";

// ── Microsite SVGs (ms-1…ms-6) ────────────────────────────────
import mc1 from "../assets/demo/svgs/mc1.svg";
import mc2 from "../assets/demo/svgs/mc2.svg";
import mc3 from "../assets/demo/svgs/mc3.svg";
import mc4 from "../assets/demo/svgs/mc4.svg";
import mc5 from "../assets/demo/svgs/mc5.svg";
import mc6 from "../assets/demo/svgs/mc6.svg";

// ── Ecommerce SVGs (ec-1…ec-6) ────────────────────────────────
import ec1svg from "../assets/demo/svgs/ec1.svg";
import ec2svg from "../assets/demo/svgs/ec2.svg";
import ec3svg from "../assets/demo/svgs/ec3.svg";
import ec4svg from "../assets/demo/svgs/ec4.svg";
import ec5svg from "../assets/demo/svgs/ec5.svg";
import ec6svg from "../assets/demo/svgs/ec6.svg";

// ── Microsite GIFs (mc1–mc6) ──────────────────────────────────
import mc1gif from "../assets/demo/gifs/mc1.gif";
import mc2gif from "../assets/demo/gifs/mc2.gif";
import mc3gif from "../assets/demo/gifs/mc3.gif";
import mc4gif from "../assets/demo/gifs/mc4.gif";
import mc5gif from "../assets/demo/gifs/mc5.gif";
import mc6gif from "../assets/demo/gifs/mc6.gif";

// ── Ecommerce GIFs (ec1–ec6) ──────────────────────────────────
import ec1gif from "../assets/demo/gifs/ec1.gif";
import ec2gif from "../assets/demo/gifs/ec2.gif";
import ec3gif from "../assets/demo/gifs/ec3.gif";
import ec4gif from "../assets/demo/gifs/ec4.gif";
import ec5gif from "../assets/demo/gifs/ec5.gif";
import ec6gif from "../assets/demo/gifs/ec6.gif";

// ── Microsite videos (mc1–mc6) ────────────────────────────────
import mc1vid from "../assets/demo/videos/mc1.mp4";
import mc2vid from "../assets/demo/videos/mc2.mp4";
import mc3vid from "../assets/demo/videos/mc3.mp4";
import mc4vid from "../assets/demo/videos/mc4.mp4";
import mc5vid from "../assets/demo/videos/mc5.mp4";
import mc6vid from "../assets/demo/videos/mc6.mp4";

// ── Ecommerce videos (ec1–ec6) ────────────────────────────────
import ec1vid from "../assets/demo/videos/ec1.mp4";
import ec2vid from "../assets/demo/videos/ec2.mp4";
import ec3vid from "../assets/demo/videos/ec3.mp4";
import ec4vid from "../assets/demo/videos/ec4.mp4";
import ec5vid from "../assets/demo/videos/ec5.mp4";
import ec6vid from "../assets/demo/videos/ec6.mp4";

import { industries } from "../utils/democontent";
import { tracker }    from "../utils/engagementTracker";
import { setP2State } from "../utils/session";

// ── Static asset maps — keyed by product ID ───────────────────
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

const ICONS = [
  <BrainCircuit size={20} strokeWidth={1.5} />,
  <ScanFace     size={20} strokeWidth={1.5} />,
  <Zap          size={20} strokeWidth={1.5} />,
];

/* ── Flatten all products once for fast lookup ─────────────── */
const ALL_PRODUCTS_FLAT = [];
industries.forEach(ind =>
  ind.products.forEach(p => ALL_PRODUCTS_FLAT.push({ ...p, industryName: ind.name }))
);

/* ── Resolve products from top3Ids array ─────────────────────
   top3Ids arrives from App via P1's onTop3 callback.
   Each id is like "ms-1" or "ec-3".
────────────────────────────────────────────────────────────── */
function resolveProducts(top3Ids) {
  if (!top3Ids || top3Ids.length === 0) return [];
  return top3Ids
    .slice(0, 3)
    .map(id => ALL_PRODUCTS_FLAT.find(p => p.id === id))
    .filter(Boolean);
}

/* ══════════════════════════════════════
   P2 INTERACTION TRACKER
══════════════════════════════════════ */
class P2InteractionTracker {
  constructor() { this._scores = {}; }

  init(productIds) {
    productIds.forEach(id => {
      if (!this._scores[id]) {
        this._scores[id] = {
          readSeconds:  0,
          maxScrollPct: 0,
          playSeconds:  0,
          imageHovered: false,
          switched:     false,
        };
      }
    });
  }

  addReadTime(productId, seconds) {
    if (this._scores[productId]) this._scores[productId].readSeconds += seconds;
  }
  updateScroll(productId, pct) {
    if (this._scores[productId])
      this._scores[productId].maxScrollPct = Math.max(this._scores[productId].maxScrollPct, pct);
  }
  addPlayTime(productId, seconds) {
    if (this._scores[productId])
      this._scores[productId].playSeconds = Math.max(this._scores[productId].playSeconds, seconds);
  }
  markImageHovered(productId) {
    if (this._scores[productId]) this._scores[productId].imageHovered = true;
  }
  markSwitched(productId) {
    if (this._scores[productId]) this._scores[productId].switched = true;
  }

  getBestProductId() {
    let best = null, bestScore = -1;
    for (const [id, s] of Object.entries(this._scores)) {
      const score =
        Math.min(s.readSeconds / 60, 1) * 40 +
        (s.maxScrollPct / 100)          * 30 +
        Math.min(s.playSeconds / 35, 1) * 20 +
        (s.imageHovered ? 1 : 0)        *  5 +
        (s.switched     ? 1 : 0)        *  5;
      if (score > bestScore) { bestScore = score; best = id; }
    }
    return best;
  }

  getWeightedScores() {
    const result = {};
    for (const [id, s] of Object.entries(this._scores)) {
      result[id] = {
        raw: s,
        weightedScore: +(
          Math.min(s.readSeconds / 60, 1) * 40 +
          (s.maxScrollPct / 100)          * 30 +
          Math.min(s.playSeconds / 35, 1) * 20 +
          (s.imageHovered ? 1 : 0)        *  5 +
          (s.switched     ? 1 : 0)        *  5
        ).toFixed(2),
      };
    }
    return result;
  }
}

/* ══════════════════════════════════════
   VIDEO PLAYER
══════════════════════════════════════ */
function IndustryVideoPlayer({ productId, onPlayClick, onPlayProgress }) {
  const videoRef    = useRef(null);
  const progressRef = useRef(null);
  const rafRef      = useRef(null);

  const [playing, setPlaying]         = useState(false);
  const [muted, setMuted]             = useState(true);
  const [progress, setProgress]       = useState(0);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoSrc = VIDEO_MAP[productId] ?? null;

  useEffect(() => {
    setPlaying(false); setProgress(0); setCurrentTime(0);
    cancelAnimationFrame(rafRef.current);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [productId]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const tick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    setProgress((vid.currentTime / (vid.duration || 1)) * 100);
    onPlayProgress?.(vid.currentTime);
    if (!vid.paused && !vid.ended) rafRef.current = requestAnimationFrame(tick);
  }, [onPlayProgress]);

  const handleTogglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) {
      vid.pause(); cancelAnimationFrame(rafRef.current); setPlaying(false);
    } else {
      vid.play().catch(() => {});
      onPlayClick?.();
      rafRef.current = requestAnimationFrame(tick);
      setPlaying(true);
    }
  }, [playing, onPlayClick, tick]);

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

  if (!videoSrc) {
    return (
      <div className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden">
        <div className="aspect-[16/7] flex items-center justify-center text-neutral-400 text-sm gap-2">
          <Play size={16} /><span>No video available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-neutral-200 overflow-hidden shadow-md">
      {/* Video frame */}
      <div className="relative aspect-[16/7] bg-black cursor-pointer group" onClick={handleTogglePlay}>
        <video
          ref={videoRef}
          src={videoSrc}
          muted={muted}
          preload="metadata"
          playsInline
          className="w-full h-full object-cover"
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); cancelAnimationFrame(rafRef.current); }}
        />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
          <div className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white shadow-lg">
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-[#1a1a1a] px-5 py-3 flex flex-col gap-2.5">
        <div ref={progressRef} className="w-full h-[3px] bg-neutral-700 rounded-full cursor-pointer relative group/bar" onClick={handleSeek}>
          <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow opacity-0 group-hover/bar:opacity-100 transition-opacity -ml-1.5" style={{ left: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleTogglePlay} className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            {playing ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>
          <button onClick={handleMuteToggle} className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
          <span className="text-[11px] text-neutral-400 tabular-nums select-none">
            {fmt(currentTime)}<span className="text-neutral-600 mx-1">/</span>{fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SMALL CARD
══════════════════════════════════════ */
function SmallCard({ id, icon, title, subtitle, desc, onClick }) {
  return (
    <motion.div
      layout layoutId={`p2card-${id}`}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="cursor-pointer h-full"
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    >
      <Squircle
        cornerRadius={30}
        cornerSmoothing={1}
        style={{ backgroundColor: "#F4F1EB" }}
        className="h-full border border-neutral-200 hover:border-neutral-300 transition-all duration-300 group shadow-sm hover:shadow"
      >
        <div className="p-5 flex flex-col min-h-[190px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 group-hover:scale-105 transition-transform">
              {icon}
            </div>
            <span className="text-[11px] tracking-wider text-neutral-500">{subtitle}</span>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-neutral-900">{title}</h3>
          <p className="mt-auto pt-3 text-[13.5px] text-neutral-600 line-clamp-3 leading-relaxed">{desc}</p>
        </div>
      </Squircle>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   LARGE CARD
══════════════════════════════════════ */
function LargeCard({
  id, productId, icon, title, subtitle, desc, image,
  howItWorks, beforeState, outcomes, whatChanges, summary,
  scrollRef, onScroll, onImageHover, onPlayClick, onPlayProgress,
}) {
  const gifSrc = GIF_MAP[productId] ?? null;

  return (
    <motion.div
      layout
      layoutId={`p2card-${id}`}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="h-full"
    >
      <Squircle
        cornerRadius={30}
        cornerSmoothing={1}
        style={{ backgroundColor: "#F4F1EB" }}
        className="h-full border border-neutral-200 shadow-sm"
      >
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="p-10 h-[500px] overflow-y-auto space-y-16 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent text-neutral-800"
        >
          {/* 1. Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-sm">
                {icon}
              </div>
              <div>
                <h2 className="text-[26px] font-semibold tracking-tight text-neutral-900">{title}</h2>
                <p className="text-[14px] text-neutral-500 mt-1">{subtitle}</p>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed text-neutral-700 max-w-2xl">{desc}</p>
          </div>

          {/* 2. Before State */}
          {(beforeState?.points?.length > 0 || image) && (
            <div className="grid grid-cols-2 gap-14 items-center">
              {beforeState?.points?.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-[16px] font-medium text-neutral-900">The Before State</h3>
                  <ul className="space-y-3 text-[14.5px] text-neutral-600 leading-relaxed">
                    {beforeState.points.map((pt, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {image && (
                <motion.div
                  className="rounded-xl border border-neutral-200 bg-white aspect-[4/3] flex items-center justify-center overflow-hidden shadow-sm cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={onImageHover}
                >
                  <img src={image} alt={title} className="w-full h-full object-contain p-6" />
                </motion.div>
              )}
            </div>
          )}

          {/* 3. Outcomes */}
          {outcomes?.points?.length > 0 && (
            <div className="grid grid-cols-2 gap-14 items-center">
              <div className="rounded-xl border border-neutral-200 bg-white aspect-[4/3] overflow-hidden shadow-sm flex items-center justify-center">
                {gifSrc ? (
                  <img src={gifSrc} alt={`${productId} outcome`} className="w-full h-full object-cover" />
                ) : image ? (
                  <img src={image} alt="Outcome visual" className="w-full h-full object-contain p-6" />
                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">Visual</div>
                )}
              </div>
              <div className="space-y-5">
                <h3 className="text-[16px] font-medium text-neutral-900">Outcomes</h3>
                <ul className="space-y-3 text-[14.5px] text-neutral-700 leading-relaxed">
                  {outcomes.points.map((pt, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-neutral-400 mt-1 flex-shrink-0">→</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 4. Video player */}
          <IndustryVideoPlayer
            productId={productId}
            onPlayClick={onPlayClick}
            onPlayProgress={onPlayProgress}
          />

          {/* 5. How It Works */}
          {howItWorks?.points?.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-[16px] font-medium text-neutral-900">How It Works</h3>
              <div className="space-y-5">
                {howItWorks.points.map((step, i) => (
                  <div key={i} className="flex gap-6 text-[14.5px] leading-relaxed">
                    <div className="text-neutral-400 font-medium flex-shrink-0">{String(i + 1).padStart(2, "0")}</div>
                    <p className="text-neutral-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. What Changes */}
          {whatChanges?.points?.length > 0 && (
            <div className="space-y-5">
              <h3 className="text-[16px] font-medium text-neutral-900">What changes</h3>
              <ul className="space-y-3 text-[14.5px] text-neutral-600 leading-relaxed">
                {whatChanges.points.map((pt, i) => (
                  <li key={i} className="border-l-2 border-neutral-300 pl-4">{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 7. Summary */}
          {summary && (
            <div className="p-7 rounded-2xl bg-white border border-neutral-200 shadow-sm text-[15px] text-neutral-700 leading-relaxed">
              {summary}
            </div>
          )}
        </div>
      </Squircle>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
   Props:
     top3Ids      — string[] from App state (set by P1's onTop3 callback)
     onBestProduct — callback(productId: string) called when section exits
══════════════════════════════════════ */
export default function Personalisation2({ top3Ids = [], onBestProduct }) {
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(0);

  const readStartRef  = useRef(null);
  const playStartRef  = useRef(null);
  const prevActiveRef = useRef(null);
  const sectionRef    = useRef(null);
  const finalizedRef  = useRef(false);
  const hasEntered    = useRef(false);

  const p2Tracker = useRef(new P2InteractionTracker());

  /* ── Resolve products — re-runs whenever top3Ids changes ── */
  const rawProducts = useMemo(
    () => resolveProducts(top3Ids),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [top3Ids.join(",")]
  );

  const cards = useMemo(() =>
    rawProducts.map((p, i) => ({
      id:          i,
      productId:   p.id,
      title:       p.level1.title,
      subtitle:    p.level2?.subtitle ?? p.level1?.subtitle ?? "",
      desc:        p.level2?.description ?? "",
      image:       IMAGE_MAP[p.id] ?? null,
      howItWorks:  p.level3?.ourBuild    ?? null,
      beforeState: p.level3?.theGap      ?? null,
      outcomes:    p.level3?.whatWeSolve ?? null,
      whatChanges: p.level3?.output
        ? { heading: p.level3.output.heading, points: p.level3.output.points }
        : null,
      summary: p.level3?.output?.summary ?? null,
      icon:    ICONS[i % ICONS.length],
    })),
    [rawProducts]
  );

  /* ── Init tracker when cards are ready ── */
  useEffect(() => {
    if (cards.length > 0) {
      p2Tracker.current.init(cards.map(c => c.productId));
    }
  }, [cards]);

  /* ── Reset active card index when new top3Ids arrive ── */
  useEffect(() => {
    if (cards.length > 0) setActiveId(0);
  }, [top3Ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCard = cards.find(c => c.id === activeId);
  const sideCards  = cards.filter(c => c.id !== activeId);

  /* ── Read time tracking on card switch ── */
  useEffect(() => {
    if (prevActiveRef.current !== null && prevActiveRef.current !== activeId) {
      const prev = cards.find(c => c.id === prevActiveRef.current);
      if (prev && readStartRef.current) {
        const secs = (Date.now() - readStartRef.current) / 1000;
        tracker.trackP2ReadTime(prev.productId, secs);
        tracker.trackP2CardSwitched(prev.productId, activeCard?.productId ?? "");
        p2Tracker.current.addReadTime(prev.productId, secs);
        p2Tracker.current.markSwitched(prev.productId);
      }
    }
    readStartRef.current  = Date.now();
    prevActiveRef.current = activeId;
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Section finalization → fires onBestProduct upward ── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const enterObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) hasEntered.current = true; },
      { threshold: 0.1 }
    );
    const exitObs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && hasEntered.current && !finalizedRef.current) {
          finalizedRef.current = true;

          if (readStartRef.current && activeCard) {
            const secs  = (Date.now() - readStartRef.current) / 1000;
            const el    = scrollRef.current;
            const depth = el
              ? Math.round((el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100)
              : 0;
            tracker.trackP2ReadTime(activeCard.productId, secs);
            p2Tracker.current.addReadTime(activeCard.productId, secs);
            p2Tracker.current.updateScroll(activeCard.productId, depth);
            setP2State({
              activeCardId: activeCard.productId,
              readTime:     secs,
              scrollDepth:  depth,
              playClicked:  playStartRef.current !== null,
              playSeconds:  playStartRef.current ? (Date.now() - playStartRef.current) / 1000 : 0,
            });
          }

          tracker.trackSectionScrolledThrough("personalisation2");

          const bestId         = p2Tracker.current.getBestProductId();
          const weightedScores = p2Tracker.current.getWeightedScores();

          if (bestId && onBestProduct) onBestProduct(bestId);
        }
      },
      { threshold: 0.05 }
    );

    enterObs.observe(sectionRef.current);
    exitObs.observe(sectionRef.current);
    return () => { enterObs.disconnect(); exitObs.disconnect(); };
  }, [activeCard, onBestProduct]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !activeCard) return;
    const pct = Math.round((el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100);
    tracker.trackP2ScrollDepth(activeCard.productId, pct);
    p2Tracker.current.updateScroll(activeCard.productId, pct);
  }, [activeCard]);

  const handleImageHover = useCallback(() => {
    if (!activeCard) return;
    tracker.trackP2ImageHover(activeCard.productId);
    p2Tracker.current.markImageHovered(activeCard.productId);
  }, [activeCard]);

  const handlePlayClick = useCallback(() => {
    if (!activeCard) return;
    tracker.trackP2PlayClicked(activeCard.productId);
    playStartRef.current = Date.now();
  }, [activeCard]);

  const handlePlayProgress = useCallback((secs) => {
    if (!activeCard) return;
    tracker.trackP2PlayProgress(activeCard.productId, secs);
    p2Tracker.current.addPlayTime(activeCard.productId, secs);
  }, [activeCard]);

  const handleCardSwitch = useCallback((cardId) => {
    const newCard = cards.find(c => c.id === cardId);
    if (newCard) p2Tracker.current.markSwitched(newCard.productId);
    setActiveId(cardId);
  }, [cards]);

  const handleNext = () => scrollRef.current?.scrollBy({ top:  250, behavior: "smooth" });
  const handlePrev = () => scrollRef.current?.scrollBy({ top: -250, behavior: "smooth" });

  /* ── Guard: render nothing until top3Ids arrive ── */
  if (cards.length === 0) return null;

  return (
    <section ref={sectionRef} id="p2" className="min-h-screen flex items-center px-6 py-28">
      <div className="relative w-full max-w-7xl mx-auto">

        {/* Scroll nav buttons */}
        <div className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 flex-col gap-4">
          <button onClick={handlePrev} className="h-11 w-11 rounded-full border border-[#DCD6CC] flex items-center justify-center hover:bg-[#F4F1EB] transition">
            <ChevronUp size={18} />
          </button>
          <button onClick={handleNext} className="h-11 w-11 rounded-full border border-[#DCD6CC] flex items-center justify-center hover:bg-[#F4F1EB] transition">
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Section header */}
        <div className="max-w-3xl">
          <h2 className="font-semibold text-[clamp(32px,4.5vw,48px)] leading-[1.1] text-[#121212]">
            This one stood out.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#121212]/65">
            We went a little deeper on this one.
          </p>
        </div>

        {/* Card layout */}
        <LayoutGroup>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_0.55fr] gap-8">
            {activeCard && (
              <LargeCard
                key={activeCard.id}
                {...activeCard}
                scrollRef={scrollRef}
                onScroll={handleScroll}
                onImageHover={handleImageHover}
                onPlayClick={handlePlayClick}
                onPlayProgress={handlePlayProgress}
              />
            )}
            <div className="flex flex-col gap-6">
              {sideCards.map(card => (
                <SmallCard
                  key={card.id}
                  {...card}
                  onClick={() => handleCardSwitch(card.id)}
                />
              ))}
            </div>
          </div>
        </LayoutGroup>

        {/* Footer hint */}
        <div className="mt-20 flex flex-col items-center text-[#121212]/60">
          <span className="text-sm">Tap to explore. Navigate to go deeper.</span>
          <div className="mt-3 border border-[#CFC8BD] rounded-full p-1 animate-bounce">
            <Pointer className="h-3 w-3" />
          </div>
        </div>

      </div>
    </section>
  );
}