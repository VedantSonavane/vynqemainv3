// Hero.jsx (Video BG + GSAP reveal on enter, repeats every time)
// ✅ same logic as your LogoSlider: split heading into lines + ScrollTrigger replay

"use client";

import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import heroBg from "../../assets/herobg.mp4"; // 👈 make sure this is a video

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);

  // reveal refs
  const hRef = useRef(null);
  const pRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headingEl = hRef.current;
      const originalHTML = headingEl?.innerHTML || "";

      // split heading into lines (preserves <br/>)
      const split = splitHeadingIntoLines(headingEl);

      // initial states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(pRef.current, { y: 14, opacity: 0 });
      gsap.set(ctaRef.current, { y: 16, opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      tl.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.085,
      })
        .to(
          pRef.current,
          { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
          "-=0.35"
        )
        .to(
          ctaRef.current,
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.38"
        );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => tl.restart(true),
        onEnterBack: () => tl.restart(true),
        onLeave: () => tl.pause(0),
        onLeaveBack: () => tl.pause(0),
      });

      return () => {
        st?.kill();
        tl?.kill();
        if (headingEl) headingEl.innerHTML = originalHTML; // restore
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative dark-section min-h-screen overflow-hidden bg-black px-4 sm:px-6 flex items-center justify-center text-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroBg}
          autoPlay
          loop
          muted
          playsInline
          style={{ transform: "scaleX(-1)" }}
        />
        <div className="absolute inset-0 bg-black/40 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
<h1
  ref={hRef}
  className="
    mt-6 font-decog text-white tracking-wide
    text-[32px]
    sm:text-[40px]
    md:text-[48px]
    lg:text-[56px]
    leading-tight
    md:leading-[1.08]
  "
>
  Turn Conversations into <br className="hidden sm:block" />
  Guided Journeys
</h1>


        <p
          ref={pRef}
          className="
            mt-5 max-w-xl text-white/80 font-medium
            text-sm sm:text-base md:text-lg
            leading-relaxed
          "
        >
      Vynqe enables businesses to align user intent with structured progression across complex decision environments.
        </p>

      
      </div>
    </section>
  );
}

/**
 * Splits the heading into “line” spans that animate cleanly,
 * while preserving <br/> as actual breaks.
 */
function splitHeadingIntoLines(el) {
  if (!el) return { lines: [] };

  // Replace <br> with a token we can split on
  const raw = el.innerHTML.replace(/<br\s*\/?>/gi, "[[BR]]");
  const parts = raw
    .split("[[BR]]")
    .map((s) => s.trim())
    .filter(Boolean);

  // Build line wrappers (mask + animated inner span)
  const html = parts
    .map((line) => {
      return `
        <span style="display:block;">
          <span class="gsap-line" style="display:inline-block; will-change:transform;">
            ${line}
          </span>
        </span>
      `;
    })
    .join('<span style="display:block; height:0.18em;"></span>');

  el.innerHTML = html;

  const lines = Array.from(el.querySelectorAll(".gsap-line"));
  return { lines };
}
