"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Slack, RefreshCcwDot, Grip, RotateCcw, Bot } from "lucide-react";
import gsap from "gsap";
import { Squircle } from "@squircle-js/react";
import { motion, AnimatePresence } from "framer-motion";
import vynqeLogoB from "../assets/vynqelogob.svg";

/* ── GUIDE MESSAGES ── */
const GUIDE_MESSAGES = [
  { id: "hero",    section: "hero",    text: "Hey, welcome 👋" },
  { id: "steps",   section: "steps",   text: "Let's explore this." },
  { id: "p1",      section: "p1",      text: "This is getting interesting." },
  { id: "p2",      section: "p2",      text: "Now it's clearer." },
  { id: "p3",      section: "p3",      text: "You're seeing the full picture." },
  { id: "demoend", section: "demoend", text: "Every journey is different." },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── GUIDE BUBBLE ──
   On mobile: sits just below the header pill, centered, smaller text.
   On desktop: same position but slightly larger.
── */
function GuideBubble({ message }) {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      /* top-[72px] covers the header height on mobile (≈64px pill + 8px gap) */
      className="fixed top-[72px] sm:top-[80px] left-0 w-full flex justify-center z-[99] pointer-events-none px-4"
    >
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-black/10 shadow-lg rounded-full px-4 py-2.5 sm:px-5 sm:py-3 pointer-events-auto max-w-[90vw] sm:max-w-none">
        <Bot size={13} className="text-gray-400 flex-shrink-0" />
        <p className="text-[12px] sm:text-[13px] text-gray-700 font-medium whitespace-nowrap truncate">
          {message.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function Header({ menuOpen, setMenuOpen }) {
  const headerRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState(GUIDE_MESSAGES[0]);
  const [bubbleVisible, setBubbleVisible]   = useState(true);
  const [chatOpen, setChatOpen]             = useState(false);

  const shownIds  = useRef(new Set());
  const hideTimer = useRef(null);

  /* ── ENTRY ANIMATION ── */
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    );
  }, []);

  /* ── AUTO HIDE BUBBLE ── */
  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBubbleVisible(false), 3500);
  }, []);

  useEffect(() => {
    scheduleHide();
    return () => clearTimeout(hideTimer.current);
  }, [currentMessage, scheduleHide]);

  /* ── SECTION OBSERVER ── */
  useEffect(() => {
    const observers = [];

    GUIDE_MESSAGES.forEach((msg) => {
      const el = document.getElementById(msg.section);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !shownIds.current.has(msg.id)) {
            shownIds.current.add(msg.id);
            setCurrentMessage(msg);
            setBubbleVisible(true);
            scheduleHide();
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [scheduleHide]);

  /* ── CLOSE MENU ON OUTSIDE TAP (MOBILE) ── */
  useEffect(() => {
    if (!chatOpen) return;
    const handler = (e) => {
      if (!headerRef.current?.contains(e.target)) setChatOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [chatOpen]);

  /* ── BUTTON ACTIONS ── */
  const handleReset = () => {
    setChatOpen(false);
    window.location.href = "/demohome";
  };

  const handleRestart = () => {
    setChatOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => window.location.reload(), 50);
  };

  const floatingButtons = [
    { icon: RefreshCcwDot, label: "Restart",  y: 70, onClick: handleRestart  },
    { icon: Grip,          label: "Products", y: 110, onClick: () => { setChatOpen(false); scrollTo("steps"); } },
  ];

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header
        ref={headerRef}
        className="fixed top-3 sm:top-4 inset-x-0 z-[100] flex justify-center px-4"
      >
        {/* Outer wrapper — relative so floating buttons anchor to it */}
        <div className="relative w-fit">

          <Squircle
            cornerRadius={50}
            cornerSmoothing={1}
            className="flex items-center gap-2 sm:gap-3 backdrop-blur-xl bg-white/70 border border-black/10 px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm"
          >
            {/* Logo — tappable, scrolls to hero */}
            <button
              onClick={() => scrollTo("hero")}
              className="flex-shrink-0 focus:outline-none"
              aria-label="Go to top"
            >
              <img
                src={vynqeLogoB}
                alt="Vynqe"
                className="h-5 sm:h-6 w-auto"
              />
            </button>

            {/* Menu toggle */}
            <motion.button
              onClick={() => setChatOpen((v) => !v)}
              aria-label={chatOpen ? "Close menu" : "Open menu"}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                chatOpen
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-500 border-transparent"
              }`}
              whileTap={{ scale: 0.92 }}
            >
              <Slack size={15} className="sm:hidden" />
              <Slack size={18} className="hidden sm:block" />
            </motion.button>

          </Squircle>

          {/* ── FLOATING ACTION BUTTONS ──
              Appear below the pill, centered on it.
              On mobile they're slightly smaller and tighter.
          ── */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none">
            <AnimatePresence>
              {chatOpen &&
                floatingButtons.map((btn, i) => {
                  const Icon = btn.icon;
                  /* Tighter spacing on mobile */
                  const mobileY = btn.y * 0.85;
                  return (
                    <motion.button
                      key={i}
                      onClick={btn.onClick}
                      initial={{ opacity: 0, scale: 0.6, y: 0 }}
                      animate={{ opacity: 1, scale: 1, y: btn.y }}
                      exit={{ opacity: 0, scale: 0.6, y: 0 }}
                      transition={{
                        delay:    i * 0.05,
                        duration: 0.28,
                        ease:     [0.22, 1, 0.36, 1],
                      }}
                      style={{ y: undefined }} /* framer handles via animate */
                      className="absolute pointer-events-auto px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-black text-white text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-lg"
                    >
                      <Icon size={12} className="sm:hidden flex-shrink-0" />
                      <Icon size={14} className="hidden sm:block flex-shrink-0" />
                      {btn.label}
                    </motion.button>
                  );
                })}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* ── GUIDE BUBBLE ── */}
      <AnimatePresence>
        {bubbleVisible && currentMessage && (
          <GuideBubble message={currentMessage} />
        )}
      </AnimatePresence>
    </>
  );
}