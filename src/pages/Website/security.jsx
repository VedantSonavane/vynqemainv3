// SecurityPolicy.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Squircle } from "@squircle-js/react";
import { ArrowLeft } from "lucide-react";

import Header from "./header"; // same import style as HomePage
import Contact from "./contact";

gsap.registerPlugin(ScrollTrigger);

export default function SecurityPolicy() {
  const pageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const containerRef = useRef(null); // right scroll container (desktop/tablet)
  const itemRefs = useRef({}); // id -> element
  const [activeId, setActiveId] = useState("our-security-posture");

  // ✅ Header nav should route back to homepage anchors
  // Clicking any item sends to "/#section"
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
        id: "our-security-posture",
        title: "Our Security Posture",
        kicker: "Condition of operation",
        body: (
          <>
            <p className="pp-text">
              Security at vynqe is not a feature — it is a condition of
              operation.
            </p>
            <p className="pp-text mt-4">
              All vynqe systems are designed to protect the confidentiality,
              integrity, and availability of information processed through guided,
              two-way communication experiences.
            </p>
            <p className="pp-text mt-4">
              Our approach prioritizes clarity, restraint, and controlled access,
              ensuring systems support customer decisions without introducing
              unnecessary exposure or risk.
            </p>
          </>
        ),
      },
      {
        id: "security-governance",
        title: "Security Governance",
        kicker: "Structure & oversight",
        body: (
          <>
            <p className="pp-text">
              vynqe maintains formal security governance structures, including:
            </p>
            <ul className="pp-list mt-3">
              <li>Documented security policies and standards</li>
              <li>Clearly defined roles and responsibilities</li>
              <li>Centralized oversight for security operations</li>
            </ul>
            <p className="pp-text mt-4">
              A dedicated security function is responsible for maintaining
              controls, monitoring compliance, and overseeing security-related
              activities across platforms and services.
            </p>
          </>
        ),
      },
      {
        id: "risk-based-security-management",
        title: "Risk-Based Security Management",
        kicker: "Measured controls",
        body: (
          <>
            <p className="pp-text">
              Security controls are applied using a structured, risk-based
              approach.
            </p>
            <ul className="pp-list mt-3">
              <li>Risks are identified and evaluated through periodic reviews</li>
              <li>Security assessments are conducted on a regular cadence</li>
              <li>
                Findings are addressed through proportional technical and
                organizational measures
              </li>
            </ul>
            <p className="pp-text mt-4">
              This ensures protections remain aligned with system purpose,
              operational scope, and evolving risk conditions.
            </p>
          </>
        ),
      },
      {
        id: "data-ownership-boundaries",
        title: "Data Ownership and Boundaries",
        kicker: "Customer control",
        body: (
          <>
            <p className="pp-text">
              Customer data processed through vynqe remains under the ownership
              and control of the originating customer or system.
            </p>
            <p className="pp-text mt-4 pp-strong">vynqe:</p>
            <ul className="pp-list mt-3">
              <li>Does not assume unrestricted ownership of customer data</li>
              <li>Operates within clearly defined handling boundaries</li>
              <li>
                Limits access, processing, and retention to what is required to
                deliver the service
              </li>
            </ul>
            <p className="pp-text mt-4">
              These boundaries are enforced through technical controls and
              internal policy.
            </p>
          </>
        ),
      },
      {
        id: "platform-level-signals",
        title: "Use of Platform-Level Signals",
        kicker: "Reliability without exposure",
        body: (
          <>
            <p className="pp-text">
              To maintain service reliability, integrity, and security, vynqe may
              derive limited, aggregated, and non-identifying platform-level
              signals.
            </p>
            <p className="pp-text mt-4">These signals are used strictly for:</p>
            <ul className="pp-list mt-3">
              <li>Operational stability</li>
              <li>Security monitoring</li>
              <li>Maintenance and improvement of the platform</li>
            </ul>
            <p className="pp-text mt-4">
              They do not expose customer content, reveal individual behavior, or
              override customer-defined controls.
            </p>
          </>
        ),
      },
      {
        id: "data-protection-controls",
        title: "Data Protection Controls",
        kicker: "Safeguards by fit",
        body: (
          <>
            <p className="pp-text">
              vynqe applies appropriate safeguards to protect information from
              unauthorized access, disclosure, alteration, or loss.
            </p>
            <p className="pp-text mt-4">Controls include:</p>
            <ul className="pp-list mt-3">
              <li>Role-based access enforcement</li>
              <li>Encryption where appropriate, in transit and at rest</li>
              <li>
                Purpose-limited data handling aligned with approved use cases
              </li>
            </ul>
            <p className="pp-text mt-4">
              Security measures are selected to match system function and
              sensitivity, not maximized unnecessarily.
            </p>
          </>
        ),
      },
      {
        id: "access-control",
        title: "Access Control",
        kicker: "Least privilege",
        body: (
          <>
            <p className="pp-text">
              Access to systems and data is restricted according to
              least-privilege principles.
            </p>
            <ul className="pp-list mt-3">
              <li>Access is granted only to authorized personnel and services</li>
              <li>Permissions are role-based and purpose-bound</li>
              <li>
                Access rights are reviewed periodically and adjusted as needed
              </li>
            </ul>
            <p className="pp-text mt-4">
              No individual or system is granted broader access than required for
              its defined role.
            </p>
          </>
        ),
      },
      {
        id: "infrastructure-security",
        title: "Infrastructure Security",
        kicker: "Layered controls",
        body: (
          <>
            <p className="pp-text">
              vynqe infrastructure operates within secured environments employing
              layered controls across:
            </p>
            <ul className="pp-list mt-3">
              <li>Network</li>
              <li>Compute</li>
              <li>Application layers</li>
            </ul>
            <p className="pp-text mt-4">
              These controls are designed to prevent unauthorized access, preserve
              system integrity, and support reliable operation without introducing
              excess complexity.
            </p>
          </>
        ),
      },
      {
        id: "privacy-aligned-security-design",
        title: "Privacy-Aligned Security Design",
        kicker: "Security + privacy together",
        body: (
          <>
            <p className="pp-text">Security and privacy are addressed together.</p>
            <p className="pp-text mt-4">Systems are designed to:</p>
            <ul className="pp-list mt-3">
              <li>Minimize unnecessary data exposure</li>
              <li>Restrict visibility by default</li>
              <li>Respect defined data and access boundaries</li>
            </ul>
            <p className="pp-text mt-4">
              This ensures security supports trust and clarity, rather than
              surveillance or over-collection.
            </p>
          </>
        ),
      },
      {
        id: "regulatory-alignment",
        title: "Regulatory Alignment",
        kicker: "DPDP & GDPR",
        body: (
          <>
            <p className="pp-text">
              vynqe’s security practices are designed to align with applicable
              regulatory and contractual requirements, including:
            </p>
            <ul className="pp-list mt-3">
              <li>India’s Digital Personal Data Protection Act (DPDP)</li>
              <li>General Data Protection Regulation (GDPR), where applicable</li>
            </ul>
            <p className="pp-text mt-4">
              Controls are strengthened over time to reflect evolving expectations
              without expanding data scope beyond necessity.
            </p>
          </>
        ),
      },
      {
        id: "policy-review",
        title: "Policy Review",
        kicker: "Kept current",
        body: (
          <>
            <p className="pp-text">
              This Security Policy is reviewed periodically and updated as required
              to reflect:
            </p>
            <ul className="pp-list mt-3">
              <li>Changes in technology</li>
              <li>Operational evolution</li>
              <li>Regulatory developments</li>
            </ul>
            <p className="pp-text mt-4">
              The most current version is maintained through official vynqe
              channels.
            </p>
          </>
        ),
      },
      {
        id: "contact",
        title: "Contact",
        kicker: "Security inquiries",
        body: (
          <>
            <p className="pp-text">
              <span className="pp-strong">Security-related inquiries</span> may be
              directed through official vynqe contact channels.
            </p>
            <p className="pp-text mt-4">
              Entity: <span className="pp-strong">vynqeCircle LLP</span>
            </p>
          </>
        ),
      },
      {
        id: "closing-statement",
        title: "Closing Statement",
        kicker: "Clarity & restraint",
        body: (
          <>
            <p className="pp-text">vynqe secures systems by design — not by accumulation.</p>
            <p className="pp-text mt-4">
              Strong security, like good decisions, depends on clarity and
              restraint.
            </p>
          </>
        ),
      },
    ],
    []
  );

  // Desktop/tablet left index scroll (inside right scroll container)
  const scrollToSectionDesktop = (id) => {
    const root = containerRef.current;
    const el = itemRefs.current[id];
    if (!root || !el) return;
    root.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: "smooth" });
  };

  // Mobile: scroll the page normally
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

      const root = containerRef.current;
      const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

      if (isDesktop && root) {
        // Desktop/tablet: animate items inside the scroll container
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
        // Mobile: animate sections on page scroll
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
      id="security-top"
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
        id="security"
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
                Security Policy
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
                      <div className="text-[11px] tracking-[0.28em] text-[#121212]/45">
                        SECTIONS
                      </div>
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

                          {/* breathing space, no visible lines */}
                          <div className="mt-8 h-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Squircle>
              </main>
            </div>

            {/* bottom breathing space */}
            <div className="h-6 sm:h-8" />
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
