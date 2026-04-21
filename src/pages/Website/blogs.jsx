import React, { useState, useMemo } from "react";
import Header from "./header";
import herobg from "../../assets/herobg.gif";

// ✅ IMPORT YOUR BLOG IMAGES
import cpaasImg from "../../assets/p5.jpeg";
import saasImg from "../../assets/p3.jpeg";

export default function VynqeBlog() {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const articles = [
    {
      category: "TECHNOLOGY",
      categoryColor: "text-blue-700",
      title: "Communication as Code: The CPaaS Revolution",
      subtitle:
        "Communication isn't just a feature anymore—it's infrastructure. Every text verification, video call, and real-time notification is now a fundamental building block of modern applications.",
      date: "March 16, 2026",
      read: "8 min read",
      href: "/blogs/cpaas",
      image: cpaasImg, // ✅ use image
    },
    {
      category: "STRATEGY",
      categoryColor: "text-pink-700",
      title: "Stop the Bleed: Diagnosing SaaS Churn",
      subtitle:
        "Most SaaS companies only notice churn at renewal. The real story starts months earlier—hidden inside onboarding gaps and missed activation moments.",
      date: "April 9, 2026",
      read: "9 min read",
      href: "/blogs/churn",
      image: saasImg, // ✅ use image
    },
  ];

  return (
    <div className="bg-[#F9F8F6] min-h-screen text-[#121212] font-sans">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      {/* HERO */}
      <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-[60px] md:text-[100px] font-bold tracking-tight leading-none mb-8">
          The vynqe Blog
        </h1>

        {/* FEATURED */}
        <div className="grid md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-12 text-left flex flex-col justify-center">
            <div className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">
              Why We Write
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-6">
              Ideas shape products. Writing shapes ideas.
            </h2>

            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              The best tech companies don't just build—they explain. Blogs are where
              raw thinking becomes clarity.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              At VYNQE, we write to think better, build faster, and share what works.
            </p>
          </div>

          <div className="relative h-[400px] overflow-hidden">
            <img
              src={herobg}
              alt="Blog Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="flex items-center justify-between pb-3 mb-8 border-b-2 border-[#121212]">
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase">
            All Articles
          </span>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {articles.map((article, i) => (
            <a
              key={article.href}
              href={article.href}
              className="grid md:grid-cols-[1fr_300px] gap-8 items-center py-8 group"
            >
              {/* TEXT */}
              <div>
                <div
                  className={`text-[10px] font-bold uppercase mb-2 ${article.categoryColor}`}
                >
                  {article.category}
                </div>

                <h3 className="text-[22px] font-bold mb-2 group-hover:underline">
                  {article.title}
                </h3>

                <p className="text-[15px] text-gray-500 mb-4">
                  {article.subtitle}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{article.read}</span>
                </div>
              </div>

              {/* ✅ IMAGE (REAL IMAGE NOW) */}
              <div className="h-[180px] rounded-xl overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}