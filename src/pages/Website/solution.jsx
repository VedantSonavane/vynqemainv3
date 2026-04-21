// Solution.jsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GitCompare, Fingerprint, Sparkles, HeartHandshake } from "lucide-react";
import { Squircle } from "@squircle-js/react";

import cardBg from "../../assets/bg.jpeg";

gsap.registerPlugin(ScrollTrigger);

/**
 * FIX: Squircle may not forward refs reliably — wrap each card in a div for GSAP
 * NEW: per-card bg motion variants (pan, flipped pan, L->R, R->L)
 */
const SolutionCard = React.forwardRef(function SolutionCard(
  { icon, title, desc, bgVariant = "pan" },
  wrapperRef
) {
const isFlipped = bgVariant === "pan-flip" || bgVariant === "rl-flip";
  const motionName =
    bgVariant === "lr"
      ? "bg-lr"
      : bgVariant === "rl"
      ? "bg-rl"
      : "bg-pan";

  return (
    <div ref={wrapperRef} className="will-change-transform">
      <Squircle
        cornerRadius={34}
        cornerSmoothing={1}
        className="
          group relative overflow-hidden
          text-white
          shadow-[0_26px_70px_rgba(0,0,0,0.22)]
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:scale-[1.02]
          hover:-translate-y-1
        "
      >
        {/* background (outer handles hover scale, inner handles motion + optional flip) */}
        <div
          className="
            absolute inset-0
            will-change-transform
            transition-transform duration-[2000ms] ease-out
            group-hover:scale-[1.15]
          "
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${cardBg})`,
              // animate background-position (no transform conflict with hover)
              animation: `${motionName} 7s ease-in-out infinite alternate`,
              // flip only the image layer for card 2
              transform: isFlipped ? "rotate(180deg) scale(1.02)" : "scale(1.02)",
            }}
          />
        </div>

        {/* overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* content wrapper */}
        <div
          className="
            relative flex flex-col
            p-7 sm:p-8 md:p-9
            min-h-[360px] sm:min-h-[380px] md:min-h-[410px]
            transition-[min-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:min-h-[390px] sm:group-hover:min-h-[410px] md:group-hover:min-h-[440px]
          "
        >
          {/* icon */}
          <div className="mb-7 sm:mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/50 shrink-0">
            {icon}
          </div>

          {/* title */}
          <h3
            className="
              whitespace-pre-line
              text-[22px] sm:text-[24px] md:text-[26px]
              leading-[1.12] tracking-tight
              text-white/90 font-semibold
              min-h-[3.2em]
            "
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>

          <div className="flex-1" />

          {/* description */}
          <p
            className="
              text-[13px] sm:text-[14px] md:text-[15px]
              leading-relaxed flex items-start
              text-white/70
              transition-all duration-500
            "
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {desc}
          </p>

          <div className="h-0 group-hover:h-2 transition-all duration-500" />
        </div>

        {/* bg motion keyframes */}
        <style>{`
          /* Card 1 (and Card 2) subtle pan */
          @keyframes bg-pan {
            0%   { background-position: 50% 50%; }
            50%  { background-position: 46% 44%; }
            100% { background-position: 50% 50%; }
          }

          /* Card 3: left -> right */
          @keyframes bg-lr {
            0%   { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          /* Card 4: right -> left */
          @keyframes bg-rl {
            0%   { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </Squircle>
    </div>
  );
});

export default function Solution() {
  const sectionRef = useRef(null);

  // header refs
  const eyebrowRef = useRef(null);
  const hRef = useRef(null);
  const pRef = useRef(null);

  // card wrapper refs
  const cardRefs = useRef([]);

const cards = useMemo(
  () => [
    {
      title: "Intent Continuity",
      desc: "Maintains intent continuity across interactions as they unfold.",
      icon: <GitCompare size={22} strokeWidth={1.25} />,
      bgVariant: "pan",
    },
    {
      title: "Progression Positioning",
      desc: "Establishes a clear progression position within active decision environments.",
      icon: <Fingerprint size={22} strokeWidth={1.25} />,
      bgVariant: "pan-flip",
    },
    {
      title: "Contextual Alignment",
      desc: "Aligns actions with live contextual conditions.",
      icon: <Sparkles size={22} strokeWidth={1.25} />,
      bgVariant: "lr",
    },
    {
      title: "Structured Advancement",
      desc: "Sustains structured advancement toward execution.",
      icon: <HeartHandshake size={22} strokeWidth={1.25} />,
      bgVariant: "rl-flip",
    },
  ],
  []
);


  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headingEl = hRef.current;
      const originalHTML = headingEl?.innerHTML || "";
      const split = splitHeadingIntoLines(headingEl);

      const cardEls = (cardRefs.current || []).filter(Boolean);

      // initial states
      gsap.set(eyebrowRef.current, { y: 10, opacity: 0 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(pRef.current, { y: 12, opacity: 0 });

      // cards: LEFT -> RIGHT (slide in from LEFT)
      gsap.set(cardEls, {
        x: -70,
        y: 14,
        opacity: 0,
        rotate: -1.2,
        filter: "blur(8px)",
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(eyebrowRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
      })
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.085,
          },
          "-=0.25"
        )
        .to(
          pRef.current,
          { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
          "-=0.35"
        )
        .to(
          cardEls,
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.14,
          },
          "-=0.25"
        );
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",

        // ✅ run only once (per refresh)
        once: true,

        // ✅ play the timeline a single time
        onEnter: () => tl.play(0),
      });


      return () => {
        st?.kill();
        tl?.kill();
        if (headingEl) headingEl.innerHTML = originalHTML;
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solution"
      className="
        relative
        min-h-screen
        bg-[#F7F5F2]
        px-4 sm:px-6
        flex items-center
        overflow-hidden
      "
    >
      <div className="w-full py-20 sm:py-24 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          {/* header (LEFT aligned) */}
          <div className="max-w-3xl text-left">
            <div
              ref={eyebrowRef}
              className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#121212]/45"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-[#121212]/25" />
              <span>The Solution</span>
            </div>

            <h2
              ref={hRef}
              className="
                font-decog mt-5 tracking-wide text-[#121212]
                text-[clamp(28px,4.5vw,48px)]
                leading-[1.1]
              "
            >
Structured Continuity in Motion
            </h2>

            <p
              ref={pRef}
              className="mt-5 text-[14px] sm:text-base md:text-lg leading-relaxed text-[#121212]/65"
            >
            Designed for industries where decision continuity matters — including financial services, enterprise technology, healthcare systems, public sector programs, and multi-stakeholder environments.

            </p>
          </div>

          {/* cards */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {cards.map((c, i) => (
              <SolutionCard
                key={i}
                title={c.title}
                desc={c.desc}
                icon={c.icon}
                bgVariant={c.bgVariant}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function splitHeadingIntoLines(el) {
  if (!el) return { lines: [] };

  const raw = el.innerHTML.replace(/<br\s*\/?>/gi, "[[BR]]");
  const parts = raw
    .split("[[BR]]")
    .map((s) => s.trim())
    .filter(Boolean);

  const html = parts
    .map(
      (line) => `
        <span style="display:block;">
          <span style="display:block; overflow:hidden;">
            <span class="gsap-line" style="display:inline-block; will-change:transform;">
              ${line}
            </span>
          </span>
        </span>
      `
    )
    .join('<span style="display:block; height:0.18em;"></span>');

  el.innerHTML = html;

  const lines = Array.from(el.querySelectorAll(".gsap-line"));
  return { lines };
}
