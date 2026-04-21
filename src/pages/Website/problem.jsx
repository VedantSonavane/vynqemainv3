// Problem.jsx
// ✅ GSAP reveal on first enter ONLY (NO repeat logic)
// ✅ Cards animate RIGHT -> LEFT one-by-one (refs fixed via wrapper div)
// ✅ Hover UI stays the same for real hover
// ✅ NEW: Auto-hover showcase on section enter (3s each card, loops while in view)

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquare, Route, Compass, Clock } from "lucide-react";
import { Squircle } from "@squircle-js/react";

import p1 from "../../assets/p1.jpeg";
import p2 from "../../assets/p2.jpeg";
import p3 from "../../assets/p3.jpeg";
import p4 from "../../assets/p4.jpeg";

gsap.registerPlugin(ScrollTrigger);

const ProblemTile = React.forwardRef(function ProblemTile(
  { Icon, title, desc, image, autoActive = false },
  wrapperRef
) {
  return (
    <div
      ref={wrapperRef}
      className={`will-change-transform ${autoActive ? "is-auto-active" : ""}`}
    >
      <Squircle
        cornerRadius={28}
        cornerSmoothing={1}
        className="
          group relative overflow-hidden
          bg-[#FBFAF8]
          shadow-3xl
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.09)]
        "
      >
        {/* FULL-CARD background image */}
        <div className="absolute inset-0 z-0">
          <div
            className="
              absolute inset-0
              bg-cover bg-center
              scale-[1.02]
              transition-transform duration-700 ease-out
              group-hover:scale-[1.12]
            "
            style={{ backgroundImage: `url(${image})` }}
          />
          {/* overlay gets darker on hover */}
          <div
            className="
              absolute inset-0
              bg-black/10
              transition-colors duration-500 ease-out
              group-hover:bg-black/60
            "
          />
          {/* vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.35)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Foreground */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Top area: SINGLE icon */}
          <div className="relative h-[180px] sm:h-[300px] md:h-[400px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  bg-white/12
                  transition-transform duration-300
                  group-hover:scale-[1.05]
                "
              >
                <Icon className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Idle copy panel (title ONLY). Slides down on hover. */}
          <div
            className="
              mt-auto
              bg-white
              p-6 sm:p-7 md:p-8
              transition-transform duration-500 ease-[cubic-bezier(.2,.9,.2,1)]
              group-hover:translate-y-[110%]
            "
          >
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] font-semibold text-[#121212]/90 leading-snug">
              {title}
            </h3>
            <p className="hidden">{desc}</p>
          </div>

          {/* Hover overlay (title + desc). Appears only on hover. */}
          <div
            className="
              pointer-events-none
              absolute left-0 right-0 bottom-0
              p-6 sm:p-7 md:p-8
              translate-y-3 opacity-0
              transition-all duration-500 ease-[cubic-bezier(.2,.9,.2,1)]
              group-hover:translate-y-0 group-hover:opacity-100
            "
          >
            <h3 className="text-[15px] sm:text-[16px] md:text-[17px] font-semibold leading-snug text-white">
              {title}
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-white/80">
              {desc}
            </p>
          </div>
        </div>
      </Squircle>
    </div>
  );
});

export default function Problem() {
  const sectionRef = useRef(null);

  // header refs
  const eyebrowRef = useRef(null);
  const hRef = useRef(null);
  const pRef = useRef(null);

  // card wrapper refs
  const cardRefs = useRef([]);

  // 🔥 auto-hover timer refs
  const autoHover = useRef({
    intervalId: null,
    timeoutId: null,
    activeIndex: -1,
    isRunning: false,
  });

 const problems = useMemo(
  () => [
    {
      Icon: MessageSquare,
      title: "Fragmentation",
      desc: "Signals disperse across platforms, preventing continuity at the moment decisions are made.",
      image: p1,
    },
    {
      Icon: Route,
      title: "Uncertainty",
      desc: "Parallel actions lack shared context, weakening real-time judgment.",
      image: p2,
    },
    {
      Icon: Compass,
      title: "Opacity",
      desc: "Progression cues remain buried within operational noise across systems and sectors.",
      image: p3,
    },
    {
      Icon: Clock,
      title: "Drag",
      desc: "Delays compound when decisions rely on fragmented, non-synchronous inputs.",
      image: p4,
    },
  ],
  []
);

  // ✅ helper: add/remove the “hovered” state by toggling a class,
  // then CSS below maps that to the SAME visual rules as group-hover.
  const setAutoActive = (index) => {
    const cards = (cardRefs.current || []).filter(Boolean);
    cards.forEach((el, i) => {
      if (!el) return;
      if (i === index) el.classList.add("is-auto-active");
      else el.classList.remove("is-auto-active");
    });
    autoHover.current.activeIndex = index;
  };

  const clearAutoActive = () => {
    const cards = (cardRefs.current || []).filter(Boolean);
    cards.forEach((el) => el?.classList.remove("is-auto-active"));
    autoHover.current.activeIndex = -1;
  };

  const stopAutoHover = () => {
    const a = autoHover.current;
    if (a.timeoutId) {
      clearTimeout(a.timeoutId);
      a.timeoutId = null;
    }
    if (a.intervalId) {
      clearInterval(a.intervalId);
      a.intervalId = null;
    }
    a.isRunning = false;
    clearAutoActive();
  };

  // 3 seconds per card
  const startAutoHover = () => {
    const cards = (cardRefs.current || []).filter(Boolean);
    if (!cards.length) return;

    const a = autoHover.current;
    if (a.isRunning) return;
    a.isRunning = true;

    let i = 0;

    // tiny delay so reveal finishes nicely
    a.timeoutId = setTimeout(() => {
      setAutoActive(i);

      a.intervalId = setInterval(() => {
        i = (i + 1) % cards.length;
        setAutoActive(i);
      }, 3000);
    }, 450);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headingEl = hRef.current;
      const originalHTML = headingEl?.innerHTML || "";
      const split = splitHeadingIntoLines(headingEl);

      const cards = (cardRefs.current || []).filter(Boolean);

      // initial
      gsap.set(eyebrowRef.current, { y: 10, opacity: 0 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(pRef.current, { y: 12, opacity: 0 });

      gsap.set(cards, {
        x: 70,
        y: 14,
        opacity: 0,
        rotate: 1.2,
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
          cards,
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

      // ✅ reveal plays once
      const stReveal = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter: () => {
          tl.play();
          // start auto-hover after reveal starts (feels polished)
          startAutoHover();
        },
      });

      // ✅ auto-hover runs only while section is in view
      const stHover = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => startAutoHover(),
        onEnterBack: () => startAutoHover(),
        onLeave: () => stopAutoHover(),
        onLeaveBack: () => stopAutoHover(),
      });

      // ✅ if user actually hovers a card, pause the auto-loop (better UX)
      const onPointerEnter = () => stopAutoHover();
      const onPointerLeave = () => {
        // restart only if section is still in view
        if (stHover?.isActive) startAutoHover();
      };

      cards.forEach((el) => {
        el.addEventListener("pointerenter", onPointerEnter);
        el.addEventListener("pointerleave", onPointerLeave);
      });

      return () => {
        stReveal?.kill();
        stHover?.kill();
        tl?.kill();
        stopAutoHover();

        cards.forEach((el) => {
          el.removeEventListener("pointerenter", onPointerEnter);
          el.removeEventListener("pointerleave", onPointerLeave);
        });

        if (headingEl) headingEl.innerHTML = originalHTML;
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
   <section
  ref={sectionRef}
  id="problem"
  className="
    relative
    min-h-screen
    bg-[#F7F5F2]
    px-4 sm:px-6
    flex items-center
  "
>
  {/* ✅ Auto-hover CSS that mirrors group-hover by using .is-auto-active */}
  <style jsx global>{`
    .is-auto-active .group .bg-cover {
      transform: scale(1.12);
    }
    .is-auto-active .group > .absolute.inset-0.z-0 > .absolute.inset-0.bg-black\/10 {
      background-color: rgba(0, 0, 0, 0.6);
    }
    .is-auto-active .group .shadow-\[inset_0_0_140px_rgba\(0\,0\,0\,0\.35\)\] {
      opacity: 1;
    }
    .is-auto-active .group .rounded-2xl {
      transform: scale(1.05);
    }

    /* idle panel down */
    .is-auto-active .group .group-hover\:translate-y-\[110\%\] {
      transform: translateY(110%);
    }

    /* hover overlay in */
    .is-auto-active .group .group-hover\:translate-y-0 {
      transform: translateY(0);
    }
    .is-auto-active .group .group-hover\:opacity-100 {
      opacity: 1;
    }
  `}</style>

  <div className="w-full py-20 sm:py-24 md:py-28">
    <div className="mx-auto w-full max-w-7xl">

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <div
          ref={eyebrowRef}
          className="flex items-center justify-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#121212]/45"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-[#121212]/25" />
          <span>The Gap</span>
        </div>

        <h2
          ref={hRef}
          className="
            font-decog mt-5 tracking-wide text-[#121212]
            text-[clamp(28px,4.5vw,48px)]
            leading-[1.1]
          "
        >
          When Systems Lack Continuity, Progress Breaks.
        </h2>

        <p
          ref={pRef}
          className="mt-5 sm:mt-6 text-[14px] sm:text-base md:text-lg leading-relaxed text-[#121212]/65"
        >
          Users interact across channels. Teams act independently. Without system alignment, signals remain disconnected and decisions lose momentum.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {problems.map((p, i) => (
          <ProblemTile
            key={i}
            Icon={p.Icon}
            title={p.title}
            desc={p.desc}
            image={p.image}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* ✅ Footer Line */}
      <div className="mt-16 sm:mt-20 text-center">
        <p className="text-[13px] sm:text-sm md:text-base text-[#121212]/55 leading-relaxed max-w-4xl mx-auto">
          This challenge persists across financial services, enterprise technology, healthcare systems, public sector programs, and other multi-layered decision environments.
        </p>
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
          <span style="display:block;">
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
