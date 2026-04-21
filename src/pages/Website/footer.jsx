"use client";

import React from "react";
import { Squircle } from "@squircle-js/react";
import vynqeLogo from "../../assets/vynqetag.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const FooterCol = ({
  items = [],
  onNavClick,
  horizontal = false,
  center = false,
}) => (
  <div className={center ? "flex justify-center" : "flex"}>
    <nav
      className={
        horizontal
          ? cn(
              "flex flex-wrap items-center",
              center ? "justify-center" : "",
              "gap-x-5 gap-y-3"
            )
          : cn("flex flex-col", center ? "items-center" : "", "space-y-2.5")
      }
    >
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          onClick={onNavClick ? (e) => onNavClick(e, it.href) : undefined}
          className={cn(
            "text-[13px] sm:text-[14px]",
            "text-white/75 hover:text-white transition-colors duration-200"
          )}
        >
          {it.label}
        </a>
      ))}
    </nav>
  </div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export default function FooterLikeImage({
  nav = [],
  columns = {},
  brandName = "Vynqe",
  copyright = `© ${new Date().getFullYear()} Vynqe Circle LLP. All rights reserved.`,
  linkedinUrl = "https://www.linkedin.com",
  xUrl = "https://x.com",
}) {
  const handleNavClick = (e, href) => {
    if (!href?.startsWith("#")) return;

    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 90;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", href);
  };
const sectionLinks = nav.length
  ? nav
  : [
   
      // NEW – app-level pages
      { label: "Privacy", href: "/privacy", type: "route" },
      { label: "Security", href: "/security", type: "route" },
      { label: "FAQ", href: "/faq", type: "route" },
      { label: "Blogs", href: "/blogs", type: "route" },
    ];


  // ✅ Address string requested
  const addressText = " Mumbai, In ";

  return (
    <footer className="w-full p-1 bg-transparent">
      <div className="mx-auto max-w-full">
        <div className="p-2">
          <Squircle
            cornerRadius={36}
            cornerSmoothing={1}
            className="bg-white/20 backdrop-blur-md border border-white/15 overflow-hidden"
          >
            <div className="px-6 sm:px-7 md:px-12 py-9 sm:py-10 md:py-12">
              {/* =======================
                  DESKTOP / TABLET
                  ======================= */}
              <div className="hidden md:block">
                {/* TOP ROW */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* LEFT: LOGO */}
                  <div className="flex items-center">
                    <img
                      src={vynqeLogo}
                      alt={brandName}
                      className="h-20 md:h-24 w-auto"
                      draggable={false}
                    />
                  </div>

                  {/* RIGHT: NAV + ADDRESS + SOCIAL */}
                  <div className="lg:ml-auto flex flex-col items-start lg:items-end gap-4">
                    <FooterCol
                      items={sectionLinks}
                      onNavClick={handleNavClick}
                      horizontal
                    />

                    {/* ✅ Address at bottom of nav links */}
                    <div className="text-[12px] sm:text-[13px] text-white/80">
                      {addressText}
                    </div>

                    {/* ✅ Social to the RIGHT of address (same row) */}
                    <div className="flex items-center gap-4">
                      <a
                        href="https://www.linkedin.com/company/108247193/admin/dashboard/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 rounded-full border border-white/25 text-white/80 hover:text-white hover:border-white transition-all"
                      >
                        <FontAwesomeIcon
                          icon={faLinkedinIn}
                          className="text-[18px]"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* OPTIONAL EXTRA COLUMNS */}
                {Object.keys(columns).length > 0 && (
                  <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-6">
                    {Object.entries(columns).map(([title, items]) => (
                      <div key={title} className="flex flex-col gap-4">
                        <p className="text-[12px] font-semibold tracking-wide text-white/60 uppercase">
                          {title}
                        </p>
                        <FooterCol items={items} onNavClick={handleNavClick} />
                      </div>
                    ))}
                  </div>
                )}

                {/* BOTTOM */}
                <div className="mt-12 pt-7 border-t border-white/20 text-center">
                  <p className="text-[13px] text-white/50 font-medium">
                    {copyright}
                  </p>
                </div>
              </div>

              {/* =======================
                  MOBILE
                  logo center -> nav -> address -> socials -> copyright
                  ======================= */}
              <div className="md:hidden">
                {/* Logo centered */}
                <div className="flex justify-center">
                  <img
                    src={vynqeLogo}
                    alt={brandName}
                    className="h-16 w-auto"
                    draggable={false}
                  />
                </div>

                {/* tiny divider */}
                <div className="mt-6 h-px w-full bg-white/15" />

                {/* Nav centered */}
                <div className="mt-6">
                  <FooterCol
                    items={sectionLinks}
                    onNavClick={handleNavClick}
                    horizontal
                    center
                  />
                </div>

                {/* ✅ Address under nav links */}
                <div className="mt-5 text-center text-[12px] text-white">
                  {addressText}
                </div>

                {/* Social centered */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <a
                    href="https://www.linkedin.com/company/108247193/admin/dashboard/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/70 transition-all"
                  >
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      className="text-[18px]"
                    />
                  </a>
                </div>

                {/* Copyright */}
                <div className="mt-7 pt-6 border-t border-white/15 text-center">
                  <p className="text-[12px] leading-relaxed text-white/55 font-medium">
                    {copyright}
                  </p>
                </div>
              </div>
            </div>
          </Squircle>
        </div>
      </div>
    </footer>
  );
}
