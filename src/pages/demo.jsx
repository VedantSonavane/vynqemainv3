"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  Eye,
  MousePointerClick,
  RefreshCw,
  GitMerge,
  HelpCircle,
  Zap,
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Brain,
  Star,
  LayoutGrid,
  Globe,
  Blend,
} from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Squircle } from "@squircle-js/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { industries } from "../utils/democontent";
import { useSession, setHoverResults, initializeUserId } from "../utils/session";
import { tracker } from "../utils/engagementTracker";

import Header from "./header";
import Personalisation from "./Personalisation";
import Personalisation2 from "./Personalisation2";
import Personalisation3 from "./Personalisation3";

// ── Microsite SVGs (mc1–mc6) ──────────────────────────────────
import mc1 from "../assets/demo/svgs/mc1.svg";
import mc2 from "../assets/demo/svgs/mc2.svg";
import mc3 from "../assets/demo/svgs/mc3.svg";
import mc4 from "../assets/demo/svgs/mc4.svg";
import mc5 from "../assets/demo/svgs/mc5.svg";
import mc6 from "../assets/demo/svgs/mc6.svg";

// ── Ecommerce SVGs (ec1–ec6) ──────────────────────────────────
import ec1 from "../assets/demo/svgs/ec1.svg";
import ec2 from "../assets/demo/svgs/ec2.svg";
import ec3 from "../assets/demo/svgs/ec3.svg";
import ec4 from "../assets/demo/svgs/ec4.svg";
import ec5 from "../assets/demo/svgs/ec5.svg";
import ec6 from "../assets/demo/svgs/ec6.svg";

gsap.registerPlugin(ScrollTrigger);

// ── Resolve a product by its ID from democontent ──────────────
function resolveProduct(id) {
  for (const ind of industries) {
    const p = ind.products.find((p) => p.id === id);
    if (p) return { product: p, industry: ind };
  }
  return null;
}

/* ─── Style / fonts ─── */
const StyleInjector = () => {
  useEffect(() => {
    if (!document.getElementById("tw-cdn")) {
      const tw = document.createElement("script");
      tw.id = "tw-cdn";
      tw.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tw);
    }
    if (!document.getElementById("gf-fonts")) {
      const lk = document.createElement("link");
      lk.id = "gf-fonts";
      lk.rel = "stylesheet";
      lk.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap";
      document.head.appendChild(lk);
    }
    if (!document.getElementById("mobile-base-css")) {
      const st = document.createElement("style");
      st.id = "mobile-base-css";
      st.textContent = `
        html, body { overflow-x: hidden; width: 100%; }
        * { box-sizing: border-box; }
      `;
      document.head.appendChild(st);
    }
  }, []);
  return null;
};

const fixedBgStyle = {
  background: `
    radial-gradient(ellipse 50% 60% at -5% 80%, #f5dfa0 10%, transparent 55%),
    radial-gradient(ellipse 40% 50% at 10% 95%, #f0cc90 10%, transparent 45%),
    radial-gradient(ellipse 55% 65% at 105% 55%, #c8a0e8 10%, transparent 60%),
    radial-gradient(ellipse 45% 55% at 90% 85%, #b890d8 10%, transparent 50%),
    radial-gradient(ellipse 50% 60% at 50% -10%, rgba(23, 78, 166, 0.35) 0%, transparent 60%),
    #ffffff
  `,
  fontFamily: "'Inter', sans-serif",
  backgroundAttachment: "fixed",
  backgroundSize: "115% 115%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0% 0%",
  overflowX: "hidden",
  width: "100%",
};

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
function HeroSection({ name }) {
  const [bodyRef, visible] = useInView(0.05);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const greeting = name
    ? `Hello ${name}, we've put something together just for you.`
    : "We've put something together just for you.";

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex flex-col min-h-screen"
    >
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 md:px-14 pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.050]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)",
          }}
        />

        <div
          ref={bodyRef}
          className={`max-w-7xl w-full text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-gray-900 mb-5 font-semibold px-2">
            {greeting}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-sm sm:max-w-md mx-auto leading-relaxed px-4">
            The signals were always there. Now you can see them.
          </p>

          <div className="flex gap-4 justify-center px-4">
            <button
              onClick={() => scrollTo("steps")}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-gray-900 text-white rounded-full text-sm sm:text-base font-medium transition-all hover:scale-105 active:scale-95"
            >
              See it in action
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 tracking-wide text-center px-6 w-full">
        * Demo metrics are derived from synthetic data. Live results may vary.
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   STEP CARD
══════════════════════════════════════ */
const StepCard = React.forwardRef(function StepCard(
  { id, Icon, title, desc, image, onHoverStart, onHoverEnd },
  wrapperRef,
) {
  return (
    <div
      ref={wrapperRef}
      className="will-change-transform"
      onMouseEnter={() => onHoverStart?.(id)}
      onMouseLeave={() => onHoverEnd?.(id)}
      onTouchStart={() => onHoverStart?.(id)}
      onTouchEnd={() => onHoverEnd?.(id)}
    >
      <Squircle
        cornerRadius={28}
        cornerSmoothing={1}
        className="group relative overflow-hidden bg-[#FBFAF8] border border-zinc-100 shadow-xl transition-all duration-500 hover:-translate-y-[4px] h-[260px] sm:h-[300px] md:h-[350px]"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-contain bg-center no-repeat scale-[1.02] transition-all duration-[900ms] group-hover:scale-[1.08] group-hover:blur-[8px]"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-all duration-700" />
        </div>

        <div className="relative z-10 h-full flex items-end">
          <div className="w-full">
            <div className="bg-[#F6F3EE] w-full px-4 sm:px-6 py-4 sm:py-5 transition-all duration-[700ms] group-hover:py-5 sm:group-hover:py-7">
              <div className="flex justify-center items-center gap-2 transition-all duration-500">
                {Icon && (
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
                <h3 className="text-[13px] sm:text-[15px] font-semibold text-gray-800 text-center">
                  {title}
                </h3>
              </div>

              <div className="overflow-hidden flex justify-center">
                <p
                  className="text-[12px] sm:text-[13px] text-gray-600 leading-relaxed text-center max-w-[240px]
                  max-h-0 opacity-0 translate-y-2
                  group-hover:max-h-20 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-[700ms] mt-1"
                >
                  {desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Squircle>
    </div>
  );
});

/* ══════════════════════════════════════
   ALL CARDS
══════════════════════════════════════ */
const MICROSITE_CARDS = [
  { id: "ms-1", image: mc1, Icon: Eye },
  { id: "ms-2", image: mc2, Icon: MousePointerClick },
  { id: "ms-3", image: mc3, Icon: RefreshCw },
  { id: "ms-4", image: mc4, Icon: GitMerge },
  { id: "ms-5", image: mc5, Icon: HelpCircle },
  { id: "ms-6", image: mc6, Icon: Zap },
];

const ECOMMERCE_CARDS = [
  { id: "ec-1", image: ec1, Icon: DollarSign },
  { id: "ec-2", image: ec2, Icon: ShoppingBag },
  { id: "ec-3", image: ec3, Icon: ShoppingCart },
  { id: "ec-4", image: ec4, Icon: Smartphone },
  { id: "ec-5", image: ec5, Icon: Brain },
  { id: "ec-6", image: ec6, Icon: Star },
];

function seededShuffle(arr, seed = 42) {
  const a = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_CARDS = {
  microsites: MICROSITE_CARDS,
  ecommerce: ECOMMERCE_CARDS,
  all: seededShuffle(
    MICROSITE_CARDS.flatMap((mc, i) => [mc, ECOMMERCE_CARDS[i]]),
    7,
  ),
};

/* ══════════════════════════════════════
   INDUSTRY TAB BAR
══════════════════════════════════════ */
const INDUSTRY_TABS = [
  { id: "all", label: "All", color: "#3B3B3B", Icon: LayoutGrid },
  { id: "microsites", label: "Microsites", color: "#0D652D", Icon: Globe },
  { id: "ecommerce", label: "Ecommerce", color: "#B06000", Icon: ShoppingBag },
];

function IndustryTabs({ active, onChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10 sm:mb-14 flex-wrap px-2">
      {INDUSTRY_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5
              rounded-full text-[12px] sm:text-[13px] font-medium
              transition-all duration-300
              ${
                isActive
                  ? "text-white shadow-md scale-[1.04]"
                  : "text-gray-500 bg-white/60 border border-gray-200 hover:border-gray-300 hover:text-gray-800"
              }
            `}
            style={isActive ? { backgroundColor: tab.color } : {}}
          >
            {tab.Icon && (
              <tab.Icon
                className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px]"
                strokeWidth={2}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════
   STEPS SECTION
══════════════════════════════════════ */
const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 40 + (i % 3) * 12,
    x: (i % 2 === 0 ? -1 : 1) * 18,
    scale: 0.92,
    rotate: i % 2 === 0 ? -2 : 2,
    filter: "blur(6px)",
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -20,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { delay: i * 0.03, duration: 0.3, ease: "easeIn" },
  }),
};

function StepsSection({ onHoverFinalized }) {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const hoverTimers = useRef({});
  const hasEntered = useRef(false);
  const finalizedRef = useRef(false);

  const [activeIndustry, setActiveIndustry] = useState("all");
  const [showHint, setShowHint] = useState(false);

  const activeCards = ALL_CARDS[activeIndustry] ?? [];

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setShowHint(e.isIntersecting),
      { threshold: 0.01 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.set(cards, { y: 60, opacity: 0, filter: "blur(10px)" });
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const enterObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) hasEntered.current = true;
      },
      { threshold: 0.1 },
    );
    const exitObs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && hasEntered.current && !finalizedRef.current) {
          finalizedRef.current = true;

          const result = tracker.finalizeHoverTracking();
          const hoverMap = tracker.getHoverMap();
          const hoverData = Object.entries(hoverMap)
            .map(([id, timeSpent]) => ({ id, timeSpent }))
            .sort((a, b) => b.timeSpent - a.timeSpent);

          tracker.trackSectionScrolledThrough("steps");

          setHoverResults({
            hoverMap,
            topProductId: result.topProductId,
            timeSpentSeconds: result.timeSpentSeconds,
            top3Ids: result.top3Ids,
          });

          onHoverFinalized?.({
            hoverData,
            topProductId: result.topProductId,
            timeSpentSeconds: result.timeSpentSeconds,
            top3Ids: result.top3Ids,
          });
        }
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) {
      enterObs.observe(sectionRef.current);
      exitObs.observe(sectionRef.current);
    }
    return () => {
      enterObs.disconnect();
      exitObs.disconnect();
    };
  }, [onHoverFinalized]);

  const handleHoverStart = useCallback((cardId) => {
    hoverTimers.current[cardId] = Date.now();
  }, []);

  const handleHoverEnd = useCallback((cardId) => {
    const start = hoverTimers.current[cardId];
    if (!start) return;
    const seconds = (Date.now() - start) / 1000;
    tracker.recordCardHover(cardId, seconds);
    delete hoverTimers.current[cardId];
  }, []);

  const headingCopy = {
    all: {
      title: "The full picture, finally in one place.",
      sub: "From microsites to storefronts — every signal, every step.",
    },
    microsites: {
      title: "Your microsite knows more than you think.",
      sub: "Six ways to surface what visitors are actually telling you.",
    },
    ecommerce: {
      title: "Commerce moves fast. Now your insight can too.",
      sub: "From first visit to final checkout, nothing gets missed.",
    },
  };
  const { title: headTitle, sub: headSub } = headingCopy[activeIndustry];
  const isAllTab = activeIndustry === "all";

  return (
    <section
      id="steps"
      ref={sectionRef}
      className="relative min-h-screen px-4 sm:px-6 py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndustry + "-heading"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {headTitle}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                {headSub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndustryTabs active={activeIndustry} onChange={setActiveIndustry} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeCards.map((card, i) => {
              const resolved = resolveProduct(card.id);
              const title = resolved?.product.level1.title ?? card.id;
              const desc = resolved?.product.level1.subtitle ?? "";

              if (isAllTab) {
                return (
                  <motion.div
                    key={card.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <StepCard
                      id={card.id}
                      Icon={card.Icon}
                      title={title}
                      desc={desc}
                      image={card.image}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={handleHoverEnd}
                    />
                  </motion.div>
                );
              }

              return (
                <StepCard
                  key={card.id}
                  id={card.id}
                  Icon={card.Icon}
                  title={title}
                  desc={desc}
                  image={card.image}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                  ref={(el) => (cardRefs.current[i] = el)}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hidden sm:flex fixed bottom-6 sm:bottom-8 right-4 sm:right-8 flex-col items-center text-white z-50 pointer-events-none"
          >
            <span className="mb-3 text-xs sm:text-sm font-medium tracking-wide">
              Hover for insights
            </span>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="border border-white/40 rounded-full p-2"
            >
              <Blend className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const session = useSession();
  const [searchParams] = useSearchParams();

  // Initialize userId from URL param on mount
  useEffect(() => {
    const urlUserId = searchParams.get("uid");
    initializeUserId(urlUserId);
  }, []);

  const [hoverData, setHoverData] = useState([]);
  const [top3Ids, setTop3Ids] = useState([]);
  const [bestProductId, setBestProductId] = useState(null);
  const [hoverTopProductId, setHoverTopProductId] = useState(null);
  const [hoverTimeSpentSeconds, setHoverTimeSpentSeconds] = useState(0);

  const handleHoverFinalized = useCallback(
    ({ hoverData: data, topProductId, timeSpentSeconds }) => {
      setHoverData(data ?? []);
      setHoverTopProductId(topProductId ?? null);
      setHoverTimeSpentSeconds(timeSpentSeconds ?? 0);
    },
    [],
  );

  const handleTop3 = useCallback((ids) => {
    setTop3Ids(ids);
  }, []);

  const handleBestProduct = useCallback((productId) => {
    setBestProductId(productId);
  }, []);

  return (
    <div className="selection:bg-purple-200" style={fixedBgStyle}>
      <StyleInjector />

      <Header
        sessionProfile={{
          name: session.name,
          company: session.company,
          accountType: session.accountType,
          industry: session.industry,
          deviceType: session.deviceType,
        }}
        prediction={session.prediction}
        // onBookDemoSubmit removed — bookdemo.jsx handles its own submit
      />

      <HeroSection name={session.name} />

      <StepsSection onHoverFinalized={handleHoverFinalized} />

      <Personalisation hoverData={hoverData} onTop3={handleTop3} id="p1" />

      <Personalisation2
        top3Ids={top3Ids}
        onBestProduct={handleBestProduct}
        id="p2"
      />

      <Personalisation3
        bestProductId={bestProductId}
        hoverTopProductId={hoverTopProductId}
        hoverTimeSpentSeconds={hoverTimeSpentSeconds}
        id="p3"
      />

      {/* DemoEnd has been removed — phone CTA now lives inside Personalisation3 */}
    </div>
  );
}