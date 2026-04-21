// FAQ.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, Plus, X } from "lucide-react";

import Header from "./header";
import Contact from "./contact";

function FaqItem({ q, a, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="
        w-full text-left
        rounded-2xl
        bg-white/70 backdrop-blur
        border border-black/10
        hover:bg-white/80
        transition
        px-4 sm:px-5
        py-4
      "
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[#121212] font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-snug">
              {q}
            </h4>

            <span
              className="
                shrink-0
                inline-flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-[#121212]/7
                border border-[#121212]/12
              "
              aria-hidden="true"
            >
              {/* plus -> x */}
              <span className="relative block w-5 h-5">
                <span
                  className={[
                    "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out",
                    open
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100",
                  ].join(" ")}
                >
                  <Plus size={18} className="text-[#121212]" />
                </span>
                <span
                  className={[
                    "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out",
                    open
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0",
                  ].join(" ")}
                >
                  <X size={18} className="text-[#121212]" />
                </span>
              </span>
            </span>
          </div>

          {/* Answer (smooth height) */}
          <div
            className={[
              "grid transition-all duration-250 ease-out",
              open
                ? "grid-rows-[1fr] opacity-100 mt-3"
                : "grid-rows-[0fr] opacity-0 mt-0",
            ].join(" ")}
          >
            <div className="overflow-hidden">
              <p className="pp-text">{a}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function FAQ() {
  const pageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  // ✅ Header nav should route back to homepage anchors
  const nav = useMemo(
    () => [
      { label: "Gap", href: "/#problem" },
      { label: "Solution", href: "/#solution" },
      { label: "Values", href: "/#values" },
      { label: "Kynos", href: "/#kynos" },
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        id: "faq-1",
        q: "Is this a CRM, marketing tool, or automation platform?",
        a: "No. It does not execute actions, automate workflows, or manage systems of record.",
      },
     
      {
        id: "faq-3",
        q: "What does this system fundamentally focus on?",
        a: "It focuses on continuity of understanding across interactions rather than execution, control, or automation.",
      },
      {
        id: "faq-4",
        q: "What type of problems is it designed to address?",
        a: "Situations where fragmented engagement leads to loss of context, unclear progression, or inconsistent decision experiences.",
      },
      {
        id: "faq-5",
        q: "What does it not attempt to do?",
        a: "It does not replace existing platforms, control execution, automate judgment, or centralize ownership.",
      },
      {
        id: "faq-6",
        q: "How does it work alongside existing tools?",
        a: "All existing systems continue to operate as they do today. This layer remains independent and does not interfere with workflows, authority, or ownership.",
      },
      {
        id: "faq-7",
        q: "What type of environments is this intended for?",
        a: "Environments where decisions unfold over time, judgment cannot be fully automated, and continuity and clarity matter more than speed alone.",
      },
      {
        id: "faq-8",
        q: "What does “engagement” mean in this context?",
        a: "Engagement begins as a bounded evaluation, not a forced journey, migration, or automated funnel.",
      },
      {
        id: "faq-9",
        q: "Does it define intent, preferences, or outcomes?",
        a: "No. Those remain external. This system concerns itself only with how understanding evolves across interactions.",
      },
      {
        id: "faq-10",
        q: "Does this impact existing workflows or operational responsibility?",
        a: "No. Operational responsibility, execution, and system ownership remain unchanged.",
      },
      {
        id: "faq-11",
        q: "How is impact evaluated?",
        a: "Impact is assessed through improvements in clarity, continuity, and progression across interactions—without altering existing execution or control.",
      },
    ],
    []
  );

  // ✅ Auto-split FAQs into 2 columns (works for any number, incl 11)
  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  // Simple GSAP entrance (mobile-safe)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-hero",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".faq-col",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.06,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      id="faq-top"
      className="bg-[#FBFBF9] text-[#1A1A1A] selection:bg-[#B59458] selection:text-white font-sans overflow-x-hidden"
    >
      <style>{`
        html { scroll-behavior: smooth; }

        .pp-text { font-size: 14px; line-height: 1.75; color: rgba(18,18,18,.70); }
        @media (min-width: 640px){ .pp-text { font-size: 15px; } }
        @media (min-width: 768px){ .pp-text { font-size: 16px; } }

        .pp-scroll::-webkit-scrollbar { width: 0px; height: 0px; }
        .pp-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      <section
        id="faq"
        className="
          relative
          min-h-[100svh]
          bg-[#F7F5F2]
          px-4 sm:px-6
          flex items-center
        "
      >
        <div className="w-full py-14 sm:py-18 md:py-24">
          <div className="mx-auto w-full max-w-7xl">
            {/* Hero */}
            <div className="faq-hero mx-auto max-w-3xl text-center">
              <h2
                className="
                  font-decog mt-5 tracking-wide text-[#121212]
                  text-[clamp(28px,4.5vw,48px)]
                  leading-[1.1]
                "
              >
                FAQs
              </h2>

              {/* Back */}
              <div className="mt-6 flex justify-center">
                <a
                  href="/"
                  className="
                    inline-flex border border-[#121212]/20 items-center gap-2
                    rounded-full bg-[#121212]/7 hover:bg-[#121212]/10
                    text-[#121212] px-4 py-2
                    text-[13px] sm:text-[14px]
                    transition
                  "
                >
                  <ArrowLeft size={16} />
                  Back to Home
                </a>
              </div>
            </div>

            {/* Two columns */}
            <div className="mt-10 sm:mt-14 grid gap-5 lg:gap-10 lg:grid-cols-12 items-stretch">
              {/* Column 1 */}
              <div className="faq-col lg:col-span-6">
                <div className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {leftFaqs.map((f) => (
                      <FaqItem
                        key={f.id}
                        q={f.q}
                        a={f.a}
                        open={openId === f.id}
                        onToggle={() => toggle(f.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="faq-col lg:col-span-6">
                <div className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {rightFaqs.map((f) => (
                      <FaqItem
                        key={f.id}
                        q={f.q}
                        a={f.a}
                        open={openId === f.id}
                        onToggle={() => toggle(f.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-6 sm:h-8" />
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
