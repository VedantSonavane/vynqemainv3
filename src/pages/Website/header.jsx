"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Box, X } from "lucide-react";
import gsap from "gsap";
import { Squircle } from "@squircle-js/react";
import { useNavigate } from "react-router-dom";

import vynqeLogo from "../../assets/vynqelogo.svg";
import vynqeLogoB from "../../assets/vynqelogob.svg";

export default function Header({ nav = [], menuOpen, setMenuOpen }) {
  const headerRef = useRef(null);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const navigate = useNavigate();

  // Detect background theme on scroll
  useEffect(() => {
    const handleScroll = () => {
      const darkSections = document.querySelectorAll(".dark-section");
      let overDark = false;

      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) overDark = true;
      });

      setIsDarkBg(overDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Color logic
  const barBg = isDarkBg
    ? "bg-white/10 border border-white/20 ring-white/10"
    : "bg-white/70 border border-black/10 ring-black/5";

  const navText = isDarkBg
    ? "text-white/80 hover:text-white"
    : "text-black/70 hover:text-black";

  const iconBtn = isDarkBg
    ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
    : "bg-black/5 border border-black/10 text-black hover:bg-black/8";

  const menuPanel = isDarkBg
    ? "bg-neutral-950/95 border border-white/12 text-white"
    : "bg-white/95 border border-black/10 text-neutral-900";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-5 md:px-8 pt-2"
    >
      <div className="mx-auto max-w-7xl">
        <Squircle
          cornerRadius={50}
          cornerSmoothing={1}
          as="div"
          className={[
            "relative flex items-center justify-between",
            "backdrop-blur-xl",
            "px-3 sm:px-4 py-2",
            "transition-all duration-500 ease-in-out",
            barBg,
          ].join(" ")}
        >
          {/* Desktop Logo */}
          <a href="#top" className="hidden md:flex items-center min-w-[112px]">
            <img
              src={isDarkBg ? vynqeLogo : vynqeLogoB}
              alt="Vynqe"
              className="h-6 w-auto transition-opacity duration-500"
            />
          </a>

          {/* Mobile Logo */}
          <a
            href="#top"
            className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <img
              src={isDarkBg ? vynqeLogo : vynqeLogoB}
              alt="Vynqe"
              className="h-6 w-auto transition-opacity duration-500"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${navText}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate("/acessingdemo")}
              className="group inline-flex items-center justify-center gap-3 px-2 py-2 pl-6 rounded-full text-xs font-medium uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-lg transition-all duration-300 hover:-translate-y-[1px]"
            >
              Access Demo
              <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                <ArrowUpRight
                  size={12}
                  className="group-hover:rotate-45 transition-transform"
                />
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <Squircle
            cornerRadius={50}
            as="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 ml-auto transition-colors duration-300 ${iconBtn}`}
          >
            {menuOpen ? <X size={20} /> : <Box size={20} />}
          </Squircle>
        </Squircle>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 top-[76px] z-[95] md:hidden px-3">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />

            <div className="relative mt-2">
              <Squircle
                cornerRadius={28}
                cornerSmoothing={1}
                className={`w-full shadow-2xl p-4 transition-colors duration-500 ${menuPanel}`}
              >
                <div className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full text-center py-4 text-lg font-medium rounded-2xl transition-colors ${
                        isDarkBg ? "hover:bg-white/10" : "hover:bg-black/5"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-4">
                  <Squircle
                    cornerRadius={20}
                    as="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/acessingdemo");
                    }}
                    className="w-full group flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)]"
                  >
                    Access Demo
                    <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <ArrowUpRight size={14} />
                    </span>
                  </Squircle>
                </div>
              </Squircle>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}