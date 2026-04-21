"use client";

import { useState, useEffect, useId } from "react";
import { ArrowUpRight, Phone, Home } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import VynqeLogoFull from "../assets/vynqelogofull.svg";
import { getSession, setPhone as persistPhoneToSession } from "../utils/session";
import { updatePhone } from "../utils/sheetsLogger";

/* ─────────────────────────────────────────────────────────────
   SPARKLES CORE
───────────────────────────────────────────────────────────── */
const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.2,
  speed = 2,
  particleColor = "#ffffff",
  particleDensity = 600,
}) => {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async () => {
    controls.start({ opacity: 1, transition: { duration: 1 } });
  };

  return (
    <motion.div animate={controls} className={`absolute inset-0 opacity-0 ${className}`}>
      {init && (
        <Particles
          id={id || generatedId}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background } },
            fullScreen: { enable: false },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { quantity: 4 },
              },
            },
            particles: {
              number: { value: particleDensity, density: { enable: true, area: 800 } },
              color: { value: particleColor },
              shape: { type: "circle" },
              opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: { enable: true, speed, sync: false },
              },
              size: { value: { min: minSize, max: maxSize } },
              move: {
                enable: true,
                speed: { min: 0.1, max: 0.6 },
                direction: "none",
                outModes: { default: "out" },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function DemoEnd({ apiResponse = null }) {
  const [phone, setPhoneInput]    = useState("");
  const [submitted, setSubmitted] = useState(false);

  const shards = Array.from({ length: 20 });

  const handleSubmit = async () => {
    if (!phone.trim()) return;

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "call_requested", { phone });
    }

    // 1. Persist phone to in-memory session
    persistPhoneToSession(phone.trim());
    const sess = getSession();

    // 2. Merge phone into the existing Session Behaviour row.
    //    updatePhone() sends only session_id + phone — Code.gs merges it
    //    into the row that logSession() already created. No new row is added.
    //    Phone does NOT go to BookDemo Leads (that sheet is form-data only).
    updatePhone(sess).catch(() => {});

    // 3. Formspree backup (fire-and-forget)
    const demoEndUrl = import.meta.env.VITE_FORMSPREE_DEMO_END;
    if (demoEndUrl) {
      fetch(demoEndUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          phone,
          fullName:    sess.fullName    || sess.name || "",
          email:       sess.email       || "",
          company:     sess.company     || "",
          jobTitle:    sess.jobTitle    || "",
          industry:    sess.industry    || "",
          accountType: sess.accountType || "",
          message:     sess.message     || "",
        }),
      }).catch(() => {});
    }

    setSubmitted(true);
  };

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <section
      id="demoend"
      className="relative flex min-h-screen w-full font-sans overflow-hidden"
    >

      {/* ── SHARD BACKGROUND ── */}
      <div className="absolute inset-0 flex z-0">
        {shards.map((_, i) => (
          <div
            key={i}
            className="h-full flex-1 relative"
            style={{
              background:     "linear-gradient(to top, #062f88, #1e3a8a, #000000)",
              backgroundSize: "100% 200%",
              filter:         `brightness(${1.9 + i * 0.09})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:   "linear-gradient(to right, rgba(255,255,255,0.05), transparent)",
                mixBlendMode: "overlay",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── SPARKLES ── */}
      <SparklesCore
        className="z-10"
        particleDensity={5000}
        minSize={0.6}
        maxSize={1.4}
        speed={1.5}
        particleColor="#ffffff"
      />

      {/* ── CENTER CONTENT ── */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-5 sm:px-6 py-16 sm:py-0 gap-0">

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07, ease: "easeOut" }}
          className="font-semibold text-[clamp(26px,5vw,54px)] leading-[1.1] text-white max-w-xs sm:max-w-xl px-2 sm:px-0"
        >
          You've seen what's possible.
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] leading-relaxed text-white/85 max-w-[280px] sm:max-w-sm"
        >
          The interesting part is what happens next.
          Drop your number — let's talk through it.
        </motion.p>

        {/* Phone + CTA or success */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex items-center mt-8 sm:mt-12 w-full max-w-[320px] sm:max-w-[360px]"
          >
            {/* Input — left pill */}
            <div className="flex items-center gap-2 flex-1
              bg-white/20
              border border-white/40
              border-r-0
              rounded-l-full
              px-4 sm:px-5 py-[10px] sm:py-[11px]
              backdrop-blur-md
              focus-within:bg-white/25
              focus-within:border-white/60
              transition-all duration-300"
            >
              <Phone size={13} className="text-white/60 flex-shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Your number"
                className="bg-transparent text-white text-[13px] placeholder-white/50 outline-none w-full min-w-0"
              />
            </div>

            {/* CTA — right pill */}
            <button
              onClick={handleSubmit}
              className="group inline-flex items-center gap-1.5 sm:gap-2 pl-4 sm:pl-5 pr-2 py-[9px] sm:py-[10px] rounded-r-full text-[11px] sm:text-[12px] font-semibold uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-xl transition-all duration-300 hover:-translate-y-[1px] whitespace-nowrap flex-shrink-0"
            >
              Get a Call
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight size={11} className="group-hover:rotate-45 transition-transform" />
              </span>
            </button>
          </motion.div>
        ) : (
          /* ── POST-SUBMIT ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 sm:mt-12 flex flex-col items-center gap-5"
          >
            <p className="text-[14px] sm:text-[15px] text-white/60 bg-white/[0.06] border border-white/10 rounded-full px-6 sm:px-8 py-3 sm:py-4">
              Perfect. We'll call you shortly.
            </p>

            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              onClick={handleGoHome}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold uppercase tracking-widest text-white/80 border border-white/20 hover:border-white/50 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] transition-all duration-300"
            >
              <Home size={12} className="opacity-70" />
              Back to Home
              <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <ArrowUpRight size={10} className="group-hover:rotate-45 transition-transform" />
              </span>
            </motion.button>
          </motion.div>
        )}

        {!submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-3 sm:mt-4 text-[11px] text-white/65"
          >
            Usually within one business day.
          </motion.p>
        )}

      </div>

      {/* ── FOOTER ── */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 text-white/50 text-[11px] sm:text-xs z-20 whitespace-nowrap">
        <span>Powered by</span>
        <img src={VynqeLogoFull} alt="Vynqe" className="h-5 sm:h-6" />
      </div>

      <style>{`
        @keyframes vynqeGradMove {
          0%   { background-position: 0% 100%; }
          50%  { background-position: 0% 0%;   }
          100% { background-position: 0% 100%; }
        }
      `}</style>

    </section>
  );
}