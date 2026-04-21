"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, Fingerprint, Sparkles, Pointer, Loader } from "lucide-react";

import { industries } from "../utils/democontent";
import { tracker } from "../utils/engagementTracker";
import { setP1Expanded } from "../utils/session";

/* IMAGE MAP */
import mc1 from "../assets/demo/svgs/mc1.svg";
import mc2 from "../assets/demo/svgs/mc2.svg";
import mc3 from "../assets/demo/svgs/mc3.svg";
import mc4 from "../assets/demo/svgs/mc4.svg";
import mc5 from "../assets/demo/svgs/mc5.svg";
import mc6 from "../assets/demo/svgs/mc6.svg";

import ec1 from "../assets/demo/svgs/ec1.svg";
import ec2 from "../assets/demo/svgs/ec2.svg";
import ec3 from "../assets/demo/svgs/ec3.svg";
import ec4 from "../assets/demo/svgs/ec4.svg";
import ec5 from "../assets/demo/svgs/ec5.svg";
import ec6 from "../assets/demo/svgs/ec6.svg";

const IMAGE_MAP = {
  "ms-1": mc1, "ms-2": mc2, "ms-3": mc3,
  "ms-4": mc4, "ms-5": mc5, "ms-6": mc6,
  "ec-1": ec1, "ec-2": ec2, "ec-3": ec3,
  "ec-4": ec4, "ec-5": ec5, "ec-6": ec6,
};

const ALL_PRODUCTS = industries.flatMap(ind =>
  ind.products.map(p => ({ ...p }))
);

const SLOT_ICONS = [
  <GitCompare  size={20} strokeWidth={1.25} />,
  <Fingerprint size={20} strokeWidth={1.25} />,
  <Sparkles    size={20} strokeWidth={1.25} />,
];

/* ── Detect mobile (< 768px) ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ── Resolve top-3 products from hoverData sorted by timeSpent ── */
function resolveProducts(hoverData) {
  if (!hoverData || hoverData.length === 0) return { products: [], top3Ids: [] };

  const sorted = [...hoverData]
    .sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0))
    .slice(0, 3);

  const top3Ids = sorted.map(({ id }) => id);
  const products = top3Ids
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(Boolean);

  return { products, top3Ids };
}

/* ══════════════════════════════════════
   MAIN EXPORT
   Props:
     hoverData  — [{ id, timeSpent }] from StepsSection
     onTop3     — callback(top3Ids[]) called once on mount when data is ready
══════════════════════════════════════ */
export default function Personalisation({ hoverData = [], onTop3 }) {
  const [active, setActive]   = useState(null);
  const expandTimeRef         = useRef(null);
  const onTop3FiredRef        = useRef(false);
  const isMobile              = useIsMobile();

  /* ── Derive products + top3Ids from hoverData ── */
  const { products, top3Ids } = useMemo(
    () => resolveProducts(hoverData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverData.map(h => `${h.id}:${h.timeSpent}`).join(",")]
  );

  /* ── Fire onTop3 upward ONCE as soon as we have ids ── */
  useEffect(() => {
    if (top3Ids.length > 0 && !onTop3FiredRef.current) {
      onTop3FiredRef.current = true;
      onTop3?.(top3Ids);
    }
  }, [top3Ids, onTop3]);

  /* ── Build card data ── */
  const cards = useMemo(
    () =>
      products.map((p, i) => ({
        id:         p.id,
        title:      p.level1.title,
        subtitle:   p.level1.subtitle,
        desc:       p.level2.description,
        howItWorks: p.level2?.howItWorks ?? [],
        stat:       p.level2?.stat ?? null,
        image:      IMAGE_MAP[p.id] ?? null,
        icon:       SLOT_ICONS[i % SLOT_ICONS.length],
      })),
    [products]
  );

  /* ── Card expand / collapse ── */
  const handleClick = (index) => {
    const card = cards[index];
    if (active === index) {
      const secs = expandTimeRef.current
        ? (Date.now() - expandTimeRef.current) / 1000
        : 0;
      tracker.trackP1ExpandedReadTime(index, secs);
      setP1Expanded({ cardIndex: index, productId: card.id, readTime: secs });
      setActive(null);
      expandTimeRef.current = null;
    } else {
      tracker.trackP1CardExpanded(index, card.id);
      expandTimeRef.current = Date.now();
      setActive(index);
    }
  };

  if (cards.length === 0) {
    return (
      <section id="p1" className="px-4 sm:px-6 py-16 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-semibold text-[clamp(24px,5vw,48px)] text-[#121212] leading-tight">
              Your interests, distilled.
            </h2>
            <p className="mt-4 sm:mt-6 text-[14px] sm:text-[16px] text-[#121212]/65">
              Here's what seemed to matter most.
            </p>
          </div>
          <div className="mt-10 sm:mt-20 flex flex-col md:flex-row gap-4 sm:gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-[24px] sm:rounded-[34px] bg-[#F6F3EE] shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-5 sm:p-6 flex items-center justify-center min-h-[200px] md:min-h-[520px]"
              >
                <Loader size={22} strokeWidth={1.5} className="text-[#121212]/30 animate-spin" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="p1" className="px-4 sm:px-6 py-16 sm:py-28">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-semibold text-[clamp(24px,5vw,48px)] text-[#121212] leading-tight">
            Your interests, distilled.
          </h2>
          <p className="mt-4 sm:mt-6 text-[14px] sm:text-[16px] text-[#121212]/65">
            Here's what seemed to matter most.
          </p>
        </div>

        {/* CARDS — vertical stack on mobile, horizontal row on md+ */}
        <div className="mt-10 sm:mt-20 flex flex-col md:flex-row gap-4 sm:gap-6">
          {cards.map((card, i) => {
            const isActive = active === i;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleClick(i)}
                /* Desktop: flex-based width expansion */
                /* Mobile: full-width, height controlled by content */
                animate={
                  isMobile
                    ? {}
                    : { flex: isActive ? 2.5 : 1 }
                }
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="
                  cursor-pointer rounded-[24px] sm:rounded-[34px]
                  bg-[#F6F3EE] shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                  overflow-hidden p-5 sm:p-6 flex flex-col
                  w-full md:min-w-0
                "
                /* On mobile, give collapsed cards a natural height;
                   expanded cards expand naturally via AnimatePresence */
                style={
                  !isMobile ? { minHeight: 520 } : {}
                }
              >

                {/* TOP */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6 min-h-[52px] sm:h-[60px]">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 flex items-center justify-center rounded-full bg-[#121212]/5">
                    {card.icon}
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#121212]/70 leading-snug">
                    {card.subtitle}
                  </p>
                </div>

                {/* IMAGE */}
                <div className="h-[120px] sm:h-[160px] flex items-center justify-center">
                  {card.image && (
                    <img
                      src={card.image}
                      alt=""
                      className="max-w-[60%] sm:max-w-[70%] max-h-[100px] sm:max-h-[140px] object-contain"
                    />
                  )}
                </div>

                {/* TEXT */}
                <div className="mt-3 sm:mt-4">
                  <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#121212] leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[14px] sm:text-[16px] text-[#121212]/70 line-clamp-3">
                    {card.desc}
                  </p>
                </div>

                {/* EXPANDED CONTENT */}
                {/* On mobile, use AnimatePresence for clean mount/unmount;
                    on desktop, animate height like before */}
                {isMobile ? (
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ExpandedContent card={card} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={false}
                    animate={{
                      opacity:   isActive ? 1 : 0,
                      height:    isActive ? "auto" : 0,
                      marginTop: isActive ? 20 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <ExpandedContent card={card} />
                  </motion.div>
                )}

              </motion.div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-12 sm:mt-20 flex flex-col items-center text-[#121212]/50">
          <span className="mb-3 text-xs sm:text-sm">Tap to Explore</span>
          <div className="border border-[#121212]/20 rounded-full p-2 animate-bounce">
            <Pointer className="h-4 w-4" />
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Extracted expanded panel — reused in both mobile & desktop paths ── */
function ExpandedContent({ card }) {
  return (
    <div>
      <div className="h-px bg-[#121212]/10 mb-4 sm:mb-5" />

      <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#121212]/40 mb-2 sm:mb-3">
        How it works
      </p>

      <ol className="space-y-2 sm:space-y-2">
        {card.howItWorks.map((step, si) => (
          <li key={si} className="flex gap-2 text-[13px] sm:text-[14px] text-[#121212]/70">
            <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] text-white bg-[#121212] flex-shrink-0 mt-0.5">
              {si + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {card.stat && (
        <div className="mt-4 sm:mt-5 inline-block text-[11px] sm:text-[12px] px-3 py-1.5 rounded-full bg-[#121212]/5">
          {card.stat}
        </div>
      )}
    </div>
  );
}