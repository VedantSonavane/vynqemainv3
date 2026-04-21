// PrivacyPolicy.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Squircle } from "@squircle-js/react";
import { ArrowLeft } from "lucide-react";

import Header from "./header"; // same import style as HomePage
import Contact from "./contact";

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPolicy() {
  const pageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef(null); // right scroll container (desktop/tablet)
  const itemRefs = useRef({}); // id -> element
  const [activeId, setActiveId] = useState("purpose-scope");

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

  const sections = useMemo(
    () => [
      {
        id: "purpose-scope",
        title: "Purpose & Scope",
        kicker: "Why this exists",
        body: (
          <>
            <p className="pp-text">
              This Privacy Policy explains how vynqeCircle LLP (“vynqe”, “we”,
              “our”, “us”) handles information in the course of providing guided,
              two-way communication experiences that help businesses understand
              customer intent and support readiness over time.
            </p>
            <p className="pp-text mt-4">
              vynqe designs systems that listen, respond, and guide, without
              operating as a system of record, data marketplace, or autonomous
              decision engine. Our role is to support clarity and continuity,
              not to replace ownership, authority, or judgment within customer
              organizations.
            </p>
            <p className="pp-text mt-4">
              This policy applies to all interactions with vynqe services,
              including websites, interactive experiences, microsites, and
              facilitated engagements.
            </p>
          </>
        ),
      },
      {
        id: "privacy-restraint",
        title: "Privacy by Restraint",
        kicker: "Less data, better outcomes",
        body: (
          <>
            <p className="pp-text">
              vynqe is built on the principle that less data creates better
              outcomes.
            </p>
            <p className="pp-text mt-4">We process only what is necessary to:</p>
            <ul className="pp-list mt-3">
              <li>Understand interaction context</li>
              <li>Identify readiness signals</li>
              <li>Maintain continuity across conversations</li>
            </ul>
            <p className="pp-text mt-4">
              We do not collect data for resale, large-scale profiling, or
              automated decision-making. Data is never used to manipulate user
              behavior or replace human judgment.
            </p>
          </>
        ),
      },
      {
        id: "info-we-process",
        title: "Information We Process",
        kicker: "What we touch (and what we don’t)",
        body: (
          <>
            <h4 className="pp-subhead">a. Information Provided Directly</h4>
            <ul className="pp-list mt-3">
              <li>Name and business contact details</li>
              <li>Professional role or company affiliation</li>
              <li>Preferences or responses shared during interactions</li>
              <li>Consent indicators where required</li>
            </ul>

            <h4 className="pp-subhead mt-6">b. Interaction and Readiness Signals</h4>
            <ul className="pp-list mt-3">
              <li>Session-level responses and engagement markers</li>
              <li>
                Interaction flow checkpoints (e.g., progression through guided
                journeys)
              </li>
              <li>
                Non-identifying continuity references used to maintain coherence
                over time
              </li>
            </ul>
            <p className="pp-text mt-3">
              These signals are contextual, not behavioral profiles.
            </p>

            <h4 className="pp-subhead mt-6">c. Technical and Operational Information</h4>
            <ul className="pp-list mt-3">
              <li>Device and browser type</li>
              <li>Time-based system logs for integrity and security</li>
              <li>
                Coarse location data (city or region level) where legally
                required
              </li>
            </ul>

            <p className="pp-text mt-4">
              vynqe does not ingest or store financial data, health information,
              sensitive identifiers, or primary customer databases unless
              explicitly agreed under contract.
            </p>
          </>
        ),
      },
      {
        id: "how-we-use",
        title: "How We Use Information",
        kicker: "Only for continuity & clarity",
        body: (
          <>
            <p className="pp-text">Information is processed solely to:</p>
            <ul className="pp-list mt-3">
              <li>Support two-way communication experiences</li>
              <li>Understand where users are in a decision journey</li>
              <li>Deliver relevant guidance at appropriate moments</li>
              <li>Preserve continuity across interactions</li>
              <li>Meet legal and contractual obligations</li>
            </ul>
            <p className="pp-text mt-4">vynqe does not store personal data for:</p>
            <ul className="pp-list mt-3">
              <li>Automated decision-making</li>
              <li>Predictive behavioral modeling</li>
              <li>Performance scoring or surveillance</li>
            </ul>
          </>
        ),
      },
      {
        id: "cookies",
        title: "Cookies & Session Tech",
        kicker: "Minimal, purposeful use",
        body: (
          <>
            <p className="pp-text">
              vynqe uses limited cookies or equivalent technologies only where
              necessary for:
            </p>
            <ul className="pp-list mt-3">
              <li>Core functionality and security</li>
              <li>Session continuity and preference retention</li>
              <li>Consent and compliance validation</li>
            </ul>
            <p className="pp-text mt-4">
              Non-essential or marketing cookies are used only with explicit
              consent and can be withdrawn at any time.
            </p>
          </>
        ),
      },
      {
        id: "sharing",
        title: "Sharing & Disclosure",
        kicker: "No selling. Limited access.",
        body: (
          <>
            <p className="pp-text">vynqe does not sell, rent, or trade personal data.</p>
            <p className="pp-text mt-4">Information may be shared only:</p>
            <ul className="pp-list mt-3">
              <li>
                With authorized service providers operating under strict
                confidentiality
              </li>
              <li>
                In aggregated or anonymized form where individuals cannot be
                identified
              </li>
              <li>Where required by applicable law or lawful authority</li>
            </ul>
            <p className="pp-text mt-4">
              All third-party access is governed by contractual, technical, and
              security controls consistent with this policy.
            </p>
          </>
        ),
      },
      {
        id: "continuity-logging",
        title: "Continuity & Intent Logs",
        kicker: "Context, not surveillance",
        body: (
          <>
            <p className="pp-text">
              To preserve guided journeys over time, vynqe may retain limited,
              non-identifying continuity logs.
            </p>
            <p className="pp-text mt-4">These logs:</p>
            <ul className="pp-list mt-3">
              <li>Capture context, not personal behavior</li>
              <li>Support review and alignment, not monitoring</li>
              <li>Are time-bound and purpose-limited</li>
            </ul>
            <p className="pp-text mt-4">
              They do not constitute profiling, analytics at scale, or
              surveillance systems.
            </p>
          </>
        ),
      },
      {
        id: "security",
        title: "Security",
        kicker: "Baseline condition",
        body: (
          <>
            <p className="pp-text">Security is treated as a baseline condition.</p>
            <p className="pp-text mt-4">Safeguards include:</p>
            <ul className="pp-list mt-3">
              <li>Encryption in transit and at rest</li>
              <li>Role-based and segregated access controls</li>
              <li>Time-bound anonymization and deletion</li>
              <li>Periodic internal and external reviews</li>
            </ul>
            <p className="pp-text mt-4">
              No system or individual is granted access beyond what is necessary
              for its defined role.
            </p>
          </>
        ),
      },
      {
        id: "retention",
        title: "Retention",
        kicker: "Time-bound by design",
        body: (
          <ul className="pp-list">
            <li>
              Personal identifiers are retained only for as long as required for
              the stated purpose
            </li>
            <li>
              Continuity and integrity logs are retained for a limited period (up
              to 24 months)
            </li>
            <li>Data is securely deleted or anonymized when no longer required</li>
            <li>
              Retention is governed by legal, contractual, and accountability needs
            </li>
          </ul>
        ),
      },
      {
        id: "your-rights",
        title: "Your Rights",
        kicker: "Access, correction, deletion",
        body: (
          <>
            <p className="pp-text">
              Subject to applicable law, individuals may request:
            </p>
            <ul className="pp-list mt-3">
              <li>Access to information relating to them</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion where retention is no longer justified</li>
            </ul>
            <p className="pp-text mt-4">
              Requests can be submitted to:{" "}
              <a className="pp-link" href="mailto:vaultcore@vynqe.com">
                vaultcore@vynqe.com
              </a>
            </p>
          </>
        ),
      },
      {
        id: "children",
        title: "Children’s Privacy",
        kicker: "Not for under 18",
        body: (
          <p className="pp-text">
            vynqe services are not intended for individuals under 18 years of age.
            We do not knowingly collect information from minors.
          </p>
        ),
      },
      {
        id: "regulatory",
        title: "Regulatory Alignment",
        kicker: "DPDPA & GDPR where applicable",
        body: (
          <>
            <p className="pp-text">
              vynqe aligns its practices with applicable data protection frameworks,
              including:
            </p>
            <ul className="pp-list mt-3">
              <li>India’s Digital Personal Data Protection Act (DPDPA)</li>
              <li>General Data Protection Regulation (GDPR), where applicable</li>
            </ul>
            <p className="pp-text mt-4">
              Compliance is interpreted in line with vynqe’s restrained, supportive
              role.
            </p>
          </>
        ),
      },
      {
        id: "updates",
        title: "Policy Updates",
        kicker: "Current version is authoritative",
        body: (
          <p className="pp-text">
            This Privacy Policy may be updated to reflect legal, regulatory, or
            operational changes. The most current version will always be available
            through official vynqe channels.
          </p>
        ),
      },
      {
        id: "contact",
        title: "Contact",
        kicker: "Data protection contact",
        body: (
          <>
            <p className="pp-text">
              <span className="pp-strong">Data Protection Contact</span>
              <br />
              Email:{" "}
              <a className="pp-link" href="mailto:vaultcore@vynqe.com">
                vaultcore@vynqe.com
              </a>
              <br />
              Entity: vynqeCircle LLP
            </p>

            <div className="mt-6">
              <p className="pp-text mt-3">
                vynqe operates alongside your systems — not above them. Privacy,
                like decision clarity, is preserved through restraint.
              </p>
            </div>
          </>
        ),
      },
    ],
    []
  );

  const scrollToSectionDesktop = (id) => {
    const root = containerRef.current;
    const el = itemRefs.current[id];
    if (!root || !el) return;
    root.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: "smooth" });
  };

  const scrollToSectionMobile = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Active section detection (desktop/tablet only; uses right scroll container)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          );
        const id = visible[0]?.target?.id;
        if (id) setActiveId(id);
      },
      {
        root,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-10% 0px -65% 0px",
      }
    );

    sections.forEach((s) => {
      const el = itemRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // GSAP animations: hero always; desktop/tablet container-based reveals; mobile page-based reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pp-hero",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(
        ".pp-left",
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.05 }
      );

      gsap.fromTo(
        ".pp-right",
        { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );

      // kill old triggers first (safe)
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 1024px)").matches;

      const root = containerRef.current;

      if (isDesktop && root) {
        Object.values(itemRefs.current).forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                scroller: root,
                start: "top 78%",
              },
            }
          );
        });
      } else {
        sections.forEach((s) => {
          const el = document.getElementById(s.id);
          if (!el) return;
          gsap.fromTo(
            el,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
              },
            }
          );
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [sections]);

  return (
    <div
      ref={pageRef}
      id="privacy-top"
      className="bg-[#FBFBF9] text-[#1A1A1A] selection:bg-[#B59458] selection:text-white font-sans overflow-x-hidden"
    >
      <style>{`
        html { scroll-behavior: smooth; }

        /* minimal typography helpers */
        .pp-text { font-size: 14px; line-height: 1.75; color: rgba(18,18,18,.68); }
        @media (min-width: 640px){ .pp-text { font-size: 16px; } }
        @media (min-width: 768px){ .pp-text { font-size: 18px; } }

        .pp-subhead { color: #121212; font-weight: 500; font-size: 14px; }
        @media (min-width: 640px){ .pp-subhead { font-size: 16px; } }
        @media (min-width: 768px){ .pp-subhead { font-size: 18px; } }

        .pp-strong { color: #121212; font-weight: 600; }
        .pp-link { color: #121212; text-decoration: underline; text-underline-offset: 4px; }

        .pp-list { list-style: disc; padding-left: 1.25rem; color: rgba(18,18,18,.68); font-size: 14px; line-height: 1.75; }
        @media (min-width: 640px){ .pp-list { font-size: 16px; } }
        @media (min-width: 768px){ .pp-list { font-size: 18px; } }
        .pp-list li { margin-top: .45rem; }

        /* hide scrollbars */
        .pp-scroll::-webkit-scrollbar { width: 0px; height: 0px; }
        .pp-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Header */}
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      {/* Section */}
      <section
        id="privacy"
        className="
          relative
          min-h-screen
          bg-[#F7F5F2]
          px-4 sm:px-6
          flex items-start
        "
      >
        <div className="w-full py-12 sm:py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl">
            {/* Hero */}
            <div className="pp-hero mx-auto max-w-3xl text-center">
              <h2
                className="
                  font-decog mt-5 tracking-wide text-[#121212]
                  text-[clamp(28px,4.5vw,48px)]
                  leading-[1.1]
                "
              >
                Privacy Policy
              </h2>

              {/* Back button */}
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

            {/* ✅ MOBILE: simple centered page (NO left index, NO inner scroller) */}
            <div className="mt-8 sm:mt-10 lg:hidden">
              <div className="mx-auto w-full max-w-3xl">
                <Squircle
                  cornerRadius={26}
                  cornerSmoothing={1}
                  className="bg-white/60 backdrop-blur overflow-hidden"
                >
                  <div className="p-5 sm:p-7">
                    {/* optional small jump list on mobile */}
                    <div className="mb-6">
                      <div className="text-[11px] tracking-[0.28em] text-[#121212]/45">
                        SECTIONS
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sections.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => scrollToSectionMobile(s.id)}
                            className="
                              rounded-full border border-[#121212]/15
                              bg-[#121212]/5 hover:bg-[#121212]/8
                              px-3 py-1.5 text-[12px] text-[#121212]/75
                              transition
                            "
                          >
                            {s.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {sections.map((s) => (
                      <div key={s.id} id={s.id} className="py-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-[#121212] font-medium text-[18px]">
                            {s.title}
                          </h3>
                          <span className="text-[11px] text-[#121212]/40 mt-1">
                            {s.kicker}
                          </span>
                        </div>
                        <div className="mt-3">{s.body}</div>
                        <div className="mt-8 h-px bg-transparent" />
                      </div>
                    ))}
                  </div>
                </Squircle>
              </div>
            </div>

            {/* ✅ DESKTOP/TABLET: two column with left index + right inner scroll */}
            <div className="hidden lg:grid mt-10 sm:mt-14 gap-6 lg:gap-10 lg:grid-cols-12 items-stretch">
              {/* LEFT */}
              <aside className="pp-left lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <Squircle
                    cornerRadius={24}
                    cornerSmoothing={1}
                    className="
                      bg-white/55 backdrop-blur overflow-hidden
                      h-[70vh] lg:h-[72vh] p-4
                    "
                  >
                    <div className="px-1 pt-1">
                     
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {sections.map((s, idx) => {
                        const isActive = s.id === activeId;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => scrollToSectionDesktop(s.id)}
                              className={[
                                "w-full text-left rounded-xl px-3 py-2 transition",
                                "text-[13px] sm:text-[14px]",
                                isActive
                                  ? "bg-[#121212]/7 text-[#121212]"
                                  : "text-[#121212]/65 hover:bg-[#121212]/5 hover:text-[#121212]",
                              ].join(" ")}
                            >
                              <span className="mr-2 text-[#121212]/35">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className={isActive ? "font-medium" : ""}>
                                {s.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </Squircle>
                </div>
              </aside>

              {/* RIGHT */}
              <main className="pp-right lg:col-span-8">
                <Squircle
                  cornerRadius={28}
                  cornerSmoothing={1}
                  className="bg-white/55 backdrop-blur overflow-hidden"
                >
                  <div
                    ref={containerRef}
                    className="
                      pp-scroll
                      h-[70vh] lg:h-[72vh]
                      overflow-y-auto
                    "
                  >
                    <div className="p-6 lg:p-7">
                      {sections.map((s) => (
                        <div
                          key={s.id}
                          id={s.id}
                          ref={(el) => {
                            if (el) itemRefs.current[s.id] = el;
                          }}
                          className="py-4 sm:py-5"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <h3 className="text-[#121212] font-medium text-xl">
                              {s.title}
                            </h3>
                            <span className="hidden sm:inline text-[12px] md:text-[13px] text-[#121212]/40">
                              {s.kicker}
                            </span>
                          </div>

                          <div className="mt-3">{s.body}</div>

                          <div className="mt-8 h-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Squircle>
              </main>
            </div>

            <div className="h-6 sm:h-8" />
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
