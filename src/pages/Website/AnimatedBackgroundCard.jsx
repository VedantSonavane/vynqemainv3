// AnimatedBgCards.jsx
"use client";

import React from "react";

/**
 * ✅ 6 animated background-only cards with premium animations
 * - Dynamically sized to match container
 * - Rich color palettes with smooth transitions
 * - Professional motion and depth effects
 * - Full coverage backgrounds
 *
 * Usage:
 *   import { AnimatedCard1, AnimatedCard2, AnimatedCard3, AnimatedCard4, AnimatedCard5, AnimatedCard6 } from "./AnimatedBgCards";
 *   <AnimatedCard3 />
 */

const BaseCard = ({ children, className = "" }) => {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[40px]",
        "shadow-[0_30px_90px_rgba(0,0,0,0.35)]",
        "bg-black",
        "w-full h-full",
        className,
      ].join(" ")}
    >
      {children}

      {/* Shared subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[40px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
    </div>
  );
};

/** ========================================
 * Card 1: Ethereal Blob Flow (Blue → Purple → Orange)
 * ======================================== */
export const AnimatedCard1 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="c1_blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="25" />
          </filter>
          <filter id="c1_blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="c1_blur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <clipPath id="c1_clip">
            <rect width="500" height="500" rx="40" ry="40" />
          </clipPath>
          <radialGradient id="c1_grad1" cx="35%" cy="40%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
            <stop offset="60%" stopColor="#174EA6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0C1240" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="c1_grad2" cx="70%" cy="65%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#DC2626" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g clipPath="url(#c1_clip)">
          <rect width="500" height="500" fill="#0F0F0F" />

          {/* Primary blue blob */}
          <g
            filter="url(#c1_blur1)"
            style={{
              transformOrigin: "250px 250px",
              animation: "c1_blob1 8.5s cubic-bezier(0.4,0.0,0.6,1.0) infinite",
            }}
          >
            <ellipse cx="260" cy="220" rx="180" ry="200" fill="url(#c1_grad1)" />
          </g>

          {/* Secondary orange blob */}
          <g
            filter="url(#c1_blur2)"
            style={{
              transformOrigin: "250px 250px",
              animation: "c1_blob2 7.2s cubic-bezier(0.4,0.0,0.6,1.0) infinite",
            }}
          >
            <ellipse cx="330" cy="350" rx="140" ry="160" fill="url(#c1_grad2)" />
          </g>

          {/* Tertiary accent */}
          <g
            filter="url(#c1_blur3)"
            style={{
              transformOrigin: "250px 250px",
              animation: "c1_blob3 9.8s cubic-bezier(0.4,0.0,0.6,1.0) infinite",
            }}
          >
            <circle cx="180" cy="300" r="90" fill="rgba(168,85,247,0.5)" />
          </g>

          <rect width="500" height="500" fill="rgba(0,0,0,0.15)" />
        </g>
      </svg>

      <style>{`
        @keyframes c1_blob1 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          25% { transform: translate(-30px,20px) scale(1.08) rotate(15deg); }
          50% { transform: translate(20px,-25px) scale(0.95) rotate(-10deg); }
          75% { transform: translate(-15px,-30px) scale(1.05) rotate(20deg); }
        }
        @keyframes c1_blob2 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          33% { transform: translate(25px,-20px) scale(1.12) rotate(-25deg); }
          66% { transform: translate(-20px,25px) scale(0.92) rotate(18deg); }
        }
        @keyframes c1_blob3 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          40% { transform: translate(-25px,-15px) scale(1.1) rotate(30deg); }
          80% { transform: translate(20px,20px) scale(0.9) rotate(-15deg); }
        }
      `}</style>
    </BaseCard>
  );
};

/** ========================================
 * Card 2: Aurora Vortex (Green ↔ Blue ↔ Cyan)
 * ======================================== */
export const AnimatedCard2 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotating aurora layers */}
        <div className="absolute -inset-[40%] opacity-90">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, #0D652D 0deg, #1E40AF 90deg, #06B6D4 180deg, #0F766E 270deg, #0D652D 360deg)",
              filter: "blur(60px)",
              animation: "c2_aurora 12s linear infinite",
            }}
          />
        </div>

        {/* Counter-rotating layer */}
        <div className="absolute -inset-[35%] opacity-70">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #0E7490 0deg, #0D652D 120deg, #1e3a8a 240deg, #0E7490 360deg)",
              filter: "blur(80px)",
              animation: "c2_aurora_reverse 15s linear infinite",
            }}
          />
        </div>

        {/* Accent glow */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 40% 50%, rgba(6,182,212,0.6), transparent 70%)",
              filter: "blur(40px)",
              animation: "c2_shift 6s ease-in-out infinite",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/25" />
      </div>

      <style>{`
        @keyframes c2_aurora {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1.05); }
        }
        @keyframes c2_aurora_reverse {
          0% { transform: rotate(360deg) scale(1); }
          100% { transform: rotate(0deg) scale(0.98); }
        }
        @keyframes c2_shift {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(15px,-10px); }
        }
      `}</style>
    </BaseCard>
  );
};

/** ========================================
 * Card 3: Luminous Particle Garden (Blue with shimmer)
 * ======================================== */
export const AnimatedCard3 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <div className="absolute inset-0">
        {/* Core glow */}
        <div
          className="absolute -inset-[30%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 45%, rgba(59,130,246,0.8), rgba(30,66,159,0.5) 30%, transparent 65%)",
            filter: "blur(50px)",
            animation: "c3_glow 7s ease-in-out infinite",
          }}
        />

        {/* Secondary glow */}
        <div
          className="absolute -inset-[35%]"
          style={{
            background:
              "radial-gradient(circle at 65% 70%, rgba(96,165,250,0.6), transparent 60%)",
            filter: "blur(60px)",
            animation: "c3_glow_alt 8.5s ease-in-out infinite",
          }}
        />

        {/* Particle field */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const distance = 80 + (i % 5) * 25;
            const x = 250 + Math.cos(angle) * distance;
            const y = 250 + Math.sin(angle) * distance;
            const size = 1.5 + (i % 3) * 1.2;
            const duration = 4 + (i % 5) * 1.2;
            const delay = (i * 0.12).toFixed(2);

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={i % 3 === 0 ? "rgba(191,219,254,0.9)" : "rgba(147,197,253,0.7)"}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(96,165,250,0.6))",
                    animation: `c3_particle ${duration}s ease-in-out ${delay}s infinite`,
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />
              </g>
            );
          })}

          {/* Connecting lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle1 = (i / 8) * Math.PI * 2;
            const angle2 = ((i + 1) / 8) * Math.PI * 2;
            const r = 120;
            const x1 = 250 + Math.cos(angle1) * r;
            const y1 = 250 + Math.sin(angle1) * r;
            const x2 = 250 + Math.cos(angle2) * r;
            const y2 = 250 + Math.sin(angle2) * r;

            return (
              <line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(96,165,250,0.2)"
                strokeWidth="0.8"
                style={{
                  animation: `c3_line_fade ${6 + i * 0.4}s ease-in-out infinite`,
                }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 bg-black/20" />
      </div>

      <style>{`
        @keyframes c3_glow {
          0%,100% { transform: translate(-10px,5px) scale(1); opacity: 0.7; }
          50% { transform: translate(15px,-10px) scale(1.1); opacity: 0.9; }
        }
        @keyframes c3_glow_alt {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.6; }
          50% { transform: translate(-20px,15px) scale(1.12); opacity: 0.8; }
        }
        @keyframes c3_particle {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.6; }
          50% { transform: translate(0,-20px) scale(1.3); opacity: 1; }
        }
        @keyframes c3_line_fade {
          0%,100% { stroke-width: 0.8; opacity: 0.2; }
          50% { stroke-width: 1.2; opacity: 0.5; }
        }
      `}</style>
    </BaseCard>
  );
};

/** ========================================
 * Card 4: Celestial Orbit (Orange + Green + Purple)
 * ======================================== */
export const AnimatedCard4 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <div className="absolute inset-0">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-black" />

        {/* Pulsing core */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle at 35% 35%, rgba(249,115,22,0.9), rgba(168,85,247,0.5) 25%, rgba(13,101,45,0.4) 50%, transparent 75%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "c4_pulse 5.5s ease-in-out infinite",
          }}
        />

        {/* Orbit rings */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ring 1 */}
          <circle
            cx="250"
            cy="250"
            r="140"
            fill="none"
            stroke="rgba(96,165,250,0.15)"
            strokeWidth="1"
            style={{ animation: "c4_rotate 8s linear infinite" }}
          />

          {/* Ring 2 */}
          <circle
            cx="250"
            cy="250"
            r="100"
            fill="none"
            stroke="rgba(34,197,94,0.2)"
            strokeWidth="1.2"
            style={{ animation: "c4_rotate_reverse 6s linear infinite" }}
          />

          {/* Ring 3 */}
          <circle
            cx="250"
            cy="250"
            r="160"
            fill="none"
            stroke="rgba(249,115,22,0.1)"
            strokeWidth="0.8"
            style={{ animation: "c4_rotate 12s linear infinite" }}
          />

          {/* Orbiting particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 130 + (i % 3) * 20;
            const x = 250 + Math.cos(angle) * radius;
            const y = 250 + Math.sin(angle) * radius;
            const color =
              i % 3 === 0
                ? "rgba(249,115,22,0.8)"
                : i % 3 === 1
                  ? "rgba(34,197,94,0.7)"
                  : "rgba(168,85,247,0.6)";

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill={color}
                  style={{
                    filter: "drop-shadow(0 0 6px " + color + ")",
                    animation: `c4_orbit ${8 + (i % 4) * 2}s linear infinite`,
                    transformOrigin: "250px 250px",
                  }}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 bg-black/15" />
      </div>

      <style>{`
        @keyframes c4_pulse {
          0%,100% { transform: scale(1); filter: blur(40px); opacity: 0.7; }
          50% { transform: scale(1.15); filter: blur(50px); opacity: 0.9; }
        }
        @keyframes c4_rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes c4_rotate_reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes c4_orbit {
          0% { transform: rotate(0deg) translateX(0); }
          100% { transform: rotate(360deg) translateX(0); }
        }
      `}</style>
    </BaseCard>
  );
};

/** ========================================
 * Card 5: Fluid Wave Gradient (Blue → Red → Purple)
 * ======================================== */
export const AnimatedCard5 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="c5_blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
          <clipPath id="c5_clip">
            <rect width="500" height="500" rx="40" ry="40" />
          </clipPath>
          <linearGradient id="c5_grad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="40%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="c5_grad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>

        <g clipPath="url(#c5_clip)">
          <rect width="500" height="500" fill="#0A0A0A" />

          {/* Wave 1 */}
          <g
            filter="url(#c5_blur)"
            style={{
              animation: "c5_wave1 8s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            <path
              d="M-60,280 Q120,180 260,240 T520,200 L520,520 L-60,520 Z"
              fill="url(#c5_grad1)"
              opacity="0.85"
            />
          </g>

          {/* Wave 2 */}
          <g
            filter="url(#c5_blur)"
            style={{
              animation: "c5_wave2 9.5s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            <path
              d="M-40,320 Q110,220 260,290 T520,260 L520,520 L-40,520 Z"
              fill="url(#c5_grad2)"
              opacity="0.65"
            />
          </g>

          {/* Wave 3 */}
          <g
            filter="url(#c5_blur)"
            style={{
              animation: "c5_wave3 7.5s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            <path
              d="M-80,350 Q130,250 260,310 T540,280 L540,520 L-80,520 Z"
              fill="rgba(139,92,246,0.5)"
              opacity="0.45"
            />
          </g>

          <rect width="500" height="500" fill="rgba(0,0,0,0.25)" />
        </g>
      </svg>

      <style>{`
        @keyframes c5_wave1 {
          0%,100% { transform: translateX(0) translateY(0) scaleY(1); }
          25% { transform: translateX(-30px) translateY(-15px) scaleY(1.08); }
          50% { transform: translateX(0) translateY(0) scaleY(1); }
          75% { transform: translateX(30px) translateY(10px) scaleY(1.05); }
        }
        @keyframes c5_wave2 {
          0%,100% { transform: translateX(0) translateY(0) scaleY(1); }
          33% { transform: translateX(25px) translateY(12px) scaleY(1.1); }
          66% { transform: translateX(-20px) translateY(-8px) scaleY(0.95); }
        }
        @keyframes c5_wave3 {
          0%,100% { transform: translateX(0) translateY(0) scaleY(1); }
          40% { transform: translateX(-25px) translateY(-12px) scaleY(1.06); }
          80% { transform: translateX(20px) translateY(15px) scaleY(0.98); }
        }
      `}</style>
    </BaseCard>
  );
};

/** ========================================
 * Card 6: Prism Shimmer (Green + Orange + Cyan)
 * ======================================== */
export const AnimatedCard6 = ({ className = "" }) => {
  return (
    <BaseCard className={className}>
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,101,45,0.3), rgba(30,27,27,0.5), rgba(249,115,22,0.3))",
          }}
        />

        {/* Animated glow 1 */}
        <div
          className="absolute -inset-[25%]"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(34,197,94,0.8), transparent 50%)",
            filter: "blur(50px)",
            animation: "c6_glow1 6s ease-in-out infinite",
          }}
        />

        {/* Animated glow 2 */}
        <div
          className="absolute -inset-[30%]"
          style={{
            background:
              "radial-gradient(circle at 70% 60%, rgba(249,115,22,0.7), transparent 55%)",
            filter: "blur(60px)",
            animation: "c6_glow2 7.5s ease-in-out infinite",
          }}
        />

        {/* Animated glow 3 */}
        <div
          className="absolute -inset-[28%]"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(6,182,212,0.6), transparent 50%)",
            filter: "blur(45px)",
            animation: "c6_glow3 8s ease-in-out infinite",
          }}
        />

        {/* Shimmer effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.3) 25%, transparent 50%)",
            animation: "c6_shimmer 4.5s ease-in-out infinite",
            filter: "blur(8px)",
          }}
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>

      <style>{`
        @keyframes c6_glow1 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.7; }
          50% { transform: translate(-20px,-15px) scale(1.12); opacity: 0.9; }
        }
        @keyframes c6_glow2 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.6; }
          50% { transform: translate(25px,20px) scale(1.15); opacity: 0.85; }
        }
        @keyframes c6_glow3 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.5; }
          50% { transform: translate(-15px,25px) scale(1.1); opacity: 0.8; }
        }
        @keyframes c6_shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          50% { transform: translateX(50%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
    </BaseCard>
  );
};

/** Optional: Demo gallery */
export const AnimatedBgCardGallery = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl">
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard1 />
        </div>
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard2 />
        </div>
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard3 />
        </div>
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard4 />
        </div>
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard5 />
        </div>
        <div className="w-[320px] h-[360px] md:w-[440px] md:h-[380px] lg:w-[550px] lg:h-[420px]">
          <AnimatedCard6 />
        </div>
      </div>
    </div>
  );
};