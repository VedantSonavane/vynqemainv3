import React, { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./header";
import Hero from "./hero";
import Problem from "./problem";
import Solution from "./solution";
import Values from "./values";
import Kynos from "./kynos";
import About from "./about";
import Demo from "./contact";
import Footer from "./footer";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const nav = useMemo(
    () => [
      { label: "Gap", href: "#problem" },
      { label: "Solution", href: "#solution" },
      { label: "Values", href: "#values" },
      { label: "Interface", href: "#interface" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal Animations
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // Parallax Backgrounds
      gsap.utils.toArray("section").forEach((section) => {
        const bg = section.querySelector(".parallax-bg");
        if (bg) {
          gsap.to(bg, {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      // Rotating Orbits
      gsap.to(".orbit-rot", {
        rotate: 360,
        duration: 36,
        repeat: -1,
        ease: "none",
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#FBFBF9] text-[#1A1A1A] selection:bg-[#B59458] selection:text-white font-sans overflow-x-hidden">
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500&display=swap");
          .serif-font { font-family: "Cormorant Garamond", serif; }
          html { scroll-behavior: smooth; }
          .dark-section { background-color: #0F1012; color: #FBFBF9; }
          .light-section { background-color: #FBFBF9; color: #1A1A1A; }
        `}
      </style>

      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      <main>
        <Hero />
        <Problem />
        <Solution />
        <Values />
        <Kynos />
        <About />
        <Demo />
      </main>

      {/* <Footer nav={nav} /> */}
    </div>
  );
}