// Value.jsx
"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Target, Clock, Zap, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Squircle } from "@squircle-js/react";

// Assets
import p1 from "../../assets/p1.jpeg";
import p2 from "../../assets/p2.jpeg";
import p3 from "../../assets/p3.jpeg";
import p4 from "../../assets/p4.jpeg";
import p5 from "../../assets/p5.jpeg";
import p6 from "../../assets/p6.jpeg";
gsap.registerPlugin(ScrollTrigger);

/** -----------------------------
 *  Small responsive hook
 * ----------------------------- */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    if (media.addEventListener) media.addEventListener("change", onChange);
    else media.addListener(onChange);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onChange);
      else media.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/** --- CARD (shared) --- */
const Card = forwardRef(({ customClass, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 overflow-visible ${customClass ?? ""} ${
      rest.className ?? ""
    }`.trim()}
    style={{
      transformStyle: "preserve-3d",
      willChange: "transform",
      backfaceVisibility: "hidden",
      ...rest.style,
    }}
  >
    <Squircle
      cornerRadius={40}
      cornerSmoothing={1}
      className="h-full w-full border border-white/70 shadow-2xl"
      style={{ display: "block" }}
    >
      {children}
    </Squircle>
  </div>
));
Card.displayName = "Card";

/** --- DESKTOP/TABLET: SCROLL-BASED STACK SWAP --- */
const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwapScroll = ({
  width = 400,
  height = 500,
  cardDistance = 40,
  verticalDistance = 30,
  skewAmount = 2,
  children,
  scrollTriggerRef,
  // ✅ NEW: expose swap/swapBack via ref for nav buttons
  swapRef,
}) => {
  const config = {
    ease: "power2.out",
    durDrop: 0.6,
    durMove: 0.6,
    durReturn: 0.6,
    promoteOverlap: 0.7,
    returnDelay: 0.1,
  };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const isAnimatingRef = useRef(false);
  const scrollProgressRef = useRef(0);

  const layoutFromOrder = (newOrder) => {
    const total = refs.length;
    newOrder.forEach((idx, pos) => {
      const el = refs[idx].current;
      if (!el) return;
      placeNow(el, makeSlot(pos, cardDistance, verticalDistance, total), skewAmount);
    });
  };

  /** ✅ Swap front card to the back (next) */
  const swap = () => {
    if (isAnimatingRef.current) return;
    if (order.current.length < 2) return;

    isAnimatingRef.current = true;

    const [front, ...rest] = order.current;
    const elFront = refs[front].current;

    if (!elFront) {
      isAnimatingRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl.to(elFront, {
      y: "+=600",
      opacity: 0,
      duration: config.durDrop,
      ease: config.ease,
    });

    tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

    rest.forEach((idx, i) => {
      const el = refs[idx].current;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
        `promote+=${i * 0.1}`
      );
    });

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
    tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        opacity: 1,
        duration: config.durReturn,
        ease: config.ease,
      },
      "return"
    );

    tl.call(() => {
      order.current = [...rest, front];
    });
  };

  /** ✅ Bring last card to front (prev) */
  const swapBack = () => {
    if (isAnimatingRef.current) return;
    if (order.current.length < 2) return;

    isAnimatingRef.current = true;

    const current = order.current;
    const last = current[current.length - 1];
    const rest = current.slice(0, current.length - 1);
    const newOrder = [last, ...rest];
    order.current = newOrder;

    const total = refs.length;
    const elLast = refs[last].current;

    if (!elLast) {
      isAnimatingRef.current = false;
      return;
    }

    // Start from behind/below, bring to front
    gsap.set(elLast, {
      x: makeSlot(total - 1, cardDistance, verticalDistance, total).x,
      y: "+=600",
      z: makeSlot(total - 1, cardDistance, verticalDistance, total).z,
      opacity: 0,
      zIndex: total,
      xPercent: -50,
      yPercent: -50,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Bring last card up to front slot
    const frontSlot = makeSlot(0, cardDistance, verticalDistance, total);
    tl.to(elLast, {
      x: frontSlot.x,
      y: frontSlot.y,
      z: frontSlot.z,
      opacity: 1,
      duration: config.durReturn,
      ease: config.ease,
    });

    // Push rest back one slot each
    rest.forEach((idx, i) => {
      const el = refs[idx].current;
      const slot = makeSlot(i + 1, cardDistance, verticalDistance, total);
      tl.set(el, { zIndex: slot.zIndex }, 0);
      tl.to(
        el,
        { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
        `<+=${i * 0.05}`
      );
    });
  };

  /** Click any card in stack -> bring to front */
  const bringToFront = (index) => {
    if (isAnimatingRef.current) return;

    const current = order.current.slice();
    const pos = current.indexOf(index);
    if (pos <= 0) return;

    const newOrder = [index, ...current.filter((x) => x !== index)];
    order.current = newOrder;

    isAnimatingRef.current = true;

    const total = refs.length;
    const tl = gsap.timeline({
      defaults: { duration: 0.55, ease: "power3.out" },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    newOrder.forEach((idx, i) => {
      const el = refs[idx].current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, total);

      tl.set(el, { zIndex: slot.zIndex }, 0);
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          opacity: 1,
          skewY: skewAmount,
          xPercent: -50,
          yPercent: -50,
          force3D: true,
        },
        0
      );
    });
  };

  // ✅ Expose swap/swapBack to parent via ref
  useEffect(() => {
    if (swapRef) {
      swapRef.current = { swap, swapBack };
    }
  });

  // ✅ SCROLL-BASED CARD SWAPPING
  useEffect(() => {
    const container = scrollTriggerRef?.current;
    if (!container) return;

    layoutFromOrder(order.current);

    const scrollTrigger = ScrollTrigger.create({
      id: "valueScroll",
      trigger: container,
      start: "top 50%",
      end: "bottom 50%",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;

        const cardIndex = Math.floor(self.progress * (refs.length - 1));
        const targetCard = cardIndex % refs.length;

        if (order.current[0] !== targetCard && !isAnimatingRef.current) {
          const current = order.current.slice();
          const pos = current.indexOf(targetCard);

          if (pos > 0) {
            const newOrder = [targetCard, ...current.filter((x) => x !== targetCard)];
            order.current = newOrder;
            swap();
          }
        }
      },
      markers: false,
    });

    return () => {
      scrollTrigger?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs.length, cardDistance, verticalDistance, skewAmount]);

  return (
    <div className="relative perspective-[1200px]" style={{ width, height }}>
      {childArr.map((child, i) =>
        isValidElement(child)
          ? cloneElement(child, {
              key: i,
              ref: refs[i],
              style: { width, height, ...child.props.style },
              onClick: (e) => {
                e.stopPropagation();
                bringToFront(i);
                if (child.props.onClick) child.props.onClick(e);
              },
              className: "cursor-pointer select-none " + (child.props.className ?? ""),
            })
          : child
      )}
    </div>
  );
};

/** --- MOBILE: ENHANCED SWIPE CAROUSEL --- */
const MobileCarousel = ({
  width = 320,
  height = 360,
  children,
  scrollTriggerRef,
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const count = childArr.length;

  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);
  const deltaRef = useRef(0);

  const clampIndex = (i) => {
    if (count <= 0) return 0;
    return (i + count) % count;
  };

  const goTo = (next) => setIndex(() => clampIndex(next));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    gsap.to(el, { x: -index * width, duration: 0.8, ease: "power2.inOut" });
  }, [index, width]);

  const snapBack = () => {
    const el = trackRef.current;
    if (!el) return;
    gsap.to(el, { x: -index * width, duration: 0.5, ease: "power2.out" });
  };

  const onStart = (clientX) => {
    if (count <= 1) return;
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startTimeRef.current = Date.now();
    deltaRef.current = 0;
    gsap.killTweensOf(trackRef.current);
  };

  const onMove = (clientX) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startXRef.current;
    deltaRef.current = dx;
    const el = trackRef.current;
    if (!el) return;
    gsap.set(el, { x: -index * width + dx });
  };

  const onEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const dx = deltaRef.current;
    const dt = Date.now() - startTimeRef.current;
    const velocity = dx / dt;

    const threshold = Math.min(60, width * 0.15);
    const velocityThreshold = 0.15;

    if (dx < -threshold || velocity < -velocityThreshold) {
      setIndex((prev) => clampIndex(prev + 1));
    } else if (dx > threshold || velocity > velocityThreshold) {
      setIndex((prev) => clampIndex(prev - 1));
    } else {
      snapBack();
    }
  };

  useEffect(() => {
    const container = scrollTriggerRef?.current;
    if (!container) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 50%",
      end: "bottom 50%",
      onUpdate: (self) => {
        const cardIndex = Math.floor(self.progress * (count - 1));
        setIndex(cardIndex);
      },
      markers: false,
    });

    return () => scrollTrigger?.kill();
  }, [count, scrollTriggerRef]);

  return (
    <div className="w-full">
      {/* NAV ROW */}
      <div className="w-full flex items-center justify-end mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous slide"
            className="
              h-10 w-10 rounded-full
              bg-white/55 backdrop-blur-md
              border border-white/70
              shadow-[0_10px_30px_rgba(0,0,0,0.10)]
              hover:bg-white/70 hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
            "
          >
            <ChevronLeft size={18} className="text-[#121212]/70" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next slide"
            className="
              h-10 w-10 rounded-full
              bg-white/55 backdrop-blur-md
              border border-white/70
              shadow-[0_10px_30px_rgba(0,0,0,0.10)]
              hover:bg-white/70 hover:shadow-[0_14px_40px_rgba(0,0,0,0.14)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
            "
          >
            <ChevronRight size={18} className="text-[#121212]/70" />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div
        className="relative w-full"
        style={{ height }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          e.currentTarget.setPointerCapture?.(e.pointerId);
          onStart(e.clientX);
        }}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
        onPointerLeave={() => { if (isDraggingRef.current) onEnd(); }}
      >
        <div
          ref={trackRef}
          className="absolute inset-0 flex"
          style={{ width: width * count, height }}
        >
          {childArr.map((child, i) => (
            <div key={i} style={{ width, height }} className="shrink-0">
              <Squircle
                cornerRadius={40}
                cornerSmoothing={1}
                className="h-full w-full border border-white/70 shadow-2xl"
                style={{ display: "block" }}
              >
                {child}
              </Squircle>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** --- VALUE TILE --- */
const ValueTile = ({ title, desc, image }) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/25" />

      <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 flex flex-col justify-end">
        <h3
          className="font-decog text-3xl sm:text-4xl md:text-5xl leading-tight tracking-wide text-white"
          style={{ textShadow: "0 10px 30px rgba(0,0,0,0.55)" }}
        >
          {title}
        </h3>

        <p
          className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-white/85"
          style={{ textShadow: "0 10px 26px rgba(0,0,0,0.45)" }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
};

export default function Value() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const eyebrowRef = useRef(null);
  const hRef = useRef(null);
  const pRef = useRef(null);
  const rightRef = useRef(null);

  // ✅ Ref to expose swap/swapBack from CardSwapScroll
  const cardSwapActionsRef = useRef(null);

  const isSmDevice = useMediaQuery("(max-width: 639px)");
  const isMd = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  const swapWidth = isSmDevice ? 320 : isMd ? 440 : 550;
  const swapHeight = isSmDevice ? 360 : isMd ? 380 : 420;

  const values = [
    {
      Icon: Eye,
      title: "Clarity",
      desc: "Customers move forward confidently. No more second-guessing the next steps.",
      image: p1,
    },
    {
      Icon: Target,
      title: "Focus",
      desc: "Action depends on current decision validity. Attention stays on what matters now.",
      image: p2,
    },
    {
      Icon: Clock,
      title: "Timing",
      desc: "Act at the right moments. Clear visibility into the window of opportunity.",
      image: p3,
    },
    {
      Icon: Zap,
      title: "Progression",
      desc: "Steady advancement from clarity to action Where progress follows confidence, not momentum.",
      image: p4,
    },
    {
      Icon: Sparkles,
      title: "Relevance",
      desc: "Every interaction stays aligned to current context. Nothing premature. Nothing out of sync.",
      image: p5,
    },
    {
      Icon: CheckCircle2,
      title: "Readiness",
      desc: "Decisions advance only when conditions are met. Progress without pressure or force.",
      image: p6,
    },
  ];

  /** GSAP: text reveal + right-side reveal */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headingEl = hRef.current;
      const originalHTML = headingEl?.innerHTML || "";

      const split = splitHeadingIntoLines(headingEl);

      gsap.set(eyebrowRef.current, { y: 10, opacity: 0 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(pRef.current, { y: 12, opacity: 0 });

      if (rightRef.current) {
        gsap.set(rightRef.current, {
          x: 46,
          y: 10,
          opacity: 0,
          filter: "blur(8px)",
          rotate: 0.6,
          transformOrigin: "50% 50%",
        });
      }

      const tl = gsap.timeline({ paused: true });

      tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" })
        .to(
          split.lines,
          { yPercent: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.085 },
          "-=0.25"
        )
        .to(pRef.current, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" }, "-=0.35")
        .to(
          rightRef.current,
          { x: 0, y: 0, opacity: 1, rotate: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out" },
          "-=0.35"
        );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        once: true,
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
      id="values"
      className="relative min-h-screen bg-[#F7F5F2] px-4 sm:px-6 overflow-hidden"
    >
      <div
        ref={containerRef}
        className="relative z-10 mx-auto w-full max-w-7xl py-16 sm:py-20 md:py-24"
      >
        {/* MOBILE */}
        {isSmDevice ? (
          <div className="min-h-[calc(100vh-8rem)] flex flex-col">
            <div className="max-w-xl mx-auto flex flex-col items-center text-center">
              <div
                ref={eyebrowRef}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#121212]/45"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-[#121212]/25" />
                <span>The value</span>
              </div>

              <h2
                ref={hRef}
                className="font-decog mt-5 tracking-wide text-[#121212] text-4xl leading-[1.05]"
              >
                Values delivered throughout.
              </h2>

              <p ref={pRef} className="mt-5 text-[15px] leading-relaxed text-[#121212]/65">
                Clarity keeps judgement intact, focus stays aligned, timing becomes visible,
                and progression carries through the full journey with relevance and readiness
                at every step.
              </p>
            </div>

            <div className="mt-auto flex justify-center pb-2 w-full" ref={rightRef}>
              <div className="flex items-center justify-center w-full h-[520px] px-4">
                <MobileCarousel
                  width={swapWidth}
                  height={swapHeight}
                  scrollTriggerRef={containerRef}
                >
                  {values.map((v, i) => (
                    <div key={i} className="h-full w-full">
                      <ValueTile {...v} />
                    </div>
                  ))}
                </MobileCarousel>
              </div>
            </div>
          </div>
        ) : (
          /* TABLET/DESKTOP */
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">
            {/* Left */}
            <div className="max-w-xl flex flex-col items-start text-left">
              <div
                ref={eyebrowRef}
                className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#121212]/45"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-[#121212]/25" />
                <span>The value</span>
              </div>

              <h2
                ref={hRef}
                className="font-decog mt-5 tracking-wide text-[#121212] text-[clamp(28px,4.5vw,48px)] leading-[1.1]"
              >
                Movement happens with confidence, not uncertainty.
              </h2>

              <p
                ref={pRef}
                className="mt-6 text-[14px] sm:text-base md:text-lg leading-relaxed text-[#121212]/65"
              >
                Clarity keeps judgement intact, focus stays aligned, timing becomes visible,
                and progression carries through the full journey with relevance and readiness
                at every step.
              </p>
            </div>

            {/* Right */}
            <div className="relative flex justify-center lg:justify-center" ref={rightRef}>
              <div className="w-full flex justify-center lg:justify-center">
                {/* ✅ Wrapper: stack on top, nav buttons below */}
                <div className="flex flex-col items-center ">
                  <div className="w-full flex justify-center lg:justify-end items-center h-[460px] sm:h-[560px] md:h-[620px]">
                    <CardSwapScroll
                      width={swapWidth}
                      height={swapHeight}
                      cardDistance={isMd ? 24 : 24}
                      verticalDistance={isMd ? 36 : 36}
                      scrollTriggerRef={containerRef}
                      swapRef={cardSwapActionsRef}
                    >
                      {values.map((v, i) => (
                        <Card key={i}>
                          <ValueTile {...v} />
                        </Card>
                      ))}
                    </CardSwapScroll>
                  </div>

                  {/* ✅ NAV BUTTONS — below stack, right-aligned, minimal */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cardSwapActionsRef.current?.swapBack()}
                      aria-label="Previous card"
                      className="
                        h-9 w-9 rounded-full
                        bg-transparent
                        border border-[#121212]/20
                        hover:border-[#121212]/50
                        hover:bg-[#121212]/05
                        active:scale-[0.96]
                        transition-all duration-200
                        flex items-center justify-center
                      "
                    >
                      <ArrowDownLeft size={15} className="text-[#121212]/55" />
                    </button>

                    <button
                      onClick={() => cardSwapActionsRef.current?.swap()}
                      aria-label="Next card"
                      className="
                        h-9 w-9 rounded-full
                        bg-transparent
                        border border-[#121212]/20
                        hover:border-[#121212]/50
                        hover:bg-[#121212]/05
                        active:scale-[0.96]
                        transition-all duration-200
                        flex items-center justify-center
                      "
                    >
                      <ArrowUpRight size={15} className="text-[#121212]/55" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Line-split helper */
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