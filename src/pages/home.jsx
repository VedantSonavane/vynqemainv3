import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Squircle } from "@squircle-js/react";
import {
  X,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

/* Session */
import { setProfile } from "../utils/session";

/* ============================
   DATA
============================ */

const ACCOUNT_TYPES = [
  "Analyst","Competitor","Customer","Distributor","Integrator","Investor",
  "Other","Partner","Press","Prospect","Reseller","Supplier","Vendor",
];

const INDUSTRIES = [
  "ASP (Application Service Provider)","Automotive","BFSI","CPAAS",
  "Data/Telecom OEM","ERP (Enterprise Resource Planning)","Government/Military",
  "HR Tech","IT/ITES","Large Enterprise","MSP (Management Service Provider)",
  "ManagementISV","NBFC","Network Equipment Enterprise","Non-management ISV",
  "Optical Networking","Retail","Retail Tech","SAAS","Service Provider",
  "Small/Medium Enterprise","Storage Equipment","Storage Service Provider",
  "Systems Integrator","Wireless Industry",
];

/* ============================
   DEMO MODAL
============================ */

const DemoModal = ({ isOpen, onClose, onStart }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    accountType: "",
    industry: "",
    password: "",
  });
  const [error, setError]       = useState(false);
  const [launching, setLaunching] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setError(false);
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== "abhivynqe") {
      setError(true);
      return;
    }

    // ── Save profile to session ──
    setProfile({
      name:        formData.name,
      company:     formData.company,
      accountType: formData.accountType,
      industry:    formData.industry,
    });

    // ── Show launch state then navigate ──
    setLaunching(true);
    setTimeout(() => onStart(), 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl">
        <Squircle
          cornerRadius={32}
          cornerSmoothing={1}
          className="border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl"
        >
          <div className="p-8 space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-bold">
                    Access Portal
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    Initialize Session
                  </h3>
                </div>
              </div>
              <button onClick={onClose} disabled={launching}>
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            {/* ── Launch overlay ── */}
            <AnimatePresence>
              {launching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-[32px]"
                  style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
                >
                  {/* Spinner */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white"
                  />

                  <div className="text-center space-y-2">
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white text-[15px] font-medium"
                    >
                      Session initialized
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/40 text-[12px] tracking-wide"
                    >
                      Opening your demo site...
                    </motion.p>
                   
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>

              {/* Name + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition backdrop-blur-xl"
                />
                <input
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange("company")}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition backdrop-blur-xl"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-white/40">
                  Account Type
                </p>
                <div className="flex flex-wrap gap-3">
                  {ACCOUNT_TYPES.map((item) => {
                    const isSelected = formData.accountType === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: item })}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-xl ${
                          isSelected
                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                            : "bg-transparent border-white/40 text-white hover:bg-white hover:text-black hover:border-white"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-white/40">
                  Industry
                </p>
                <div className="flex flex-wrap gap-3 max-h-56 overflow-y-auto pr-2">
                  {INDUSTRIES.map((item) => {
                    const isSelected = formData.industry === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({ ...formData, industry: item })}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-xl ${
                          isSelected
                            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                            : "bg-transparent border-white/40 text-white hover:bg-white hover:text-black hover:border-white"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password */}
              <div className="relative space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange("password")}
                    placeholder="Access Password"
                    className={`w-full bg-white/5 border ${
                      error ? "border-red-500" : "border-white/10"
                    } rounded-full px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition backdrop-blur-xl`}
                  />
                  <ShieldCheck
                    className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors ${
                      error ? "text-red-500" : "text-white/30"
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-[10px] uppercase tracking-widest ml-4">
                    Invalid Access Key
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={launching}
                className="group inline-flex items-center justify-center gap-3 px-3 py-3 pl-6 rounded-full text-xs font-medium uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-lg transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-50"
              >
                simulate
                <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  <ArrowUpRight
                    size={14}
                    className="group-hover:rotate-45 transition-transform"
                  />
                </span>
              </button>

            </form>
          </div>
        </Squircle>
      </div>
    </div>
  );
};

/* ============================
   HOME
============================ */

export default function Home() {
  const navigate       = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden text-white">
      <AnimatedBackground isPermissionGranted={false} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-5xl md:text-[90px] font-bold leading-[1.05] tracking-tight mb-10">
          Engineering{" "}Decision
          <span className="italic font-light serif-font" />
          <br />
          <span className="font-bold">Continuity</span>
        </h1>

        <p className="max-w-3xl text-sm md:text-lg text-white/60 mb-12 leading-relaxed font-medium">
          This is not personalization. It is structured progression governance
          where every action is evaluated, every shift is measured, and every
          response maintains longitudinal accountability.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-3 px-3 py-3 pl-6 rounded-full text-xs font-medium uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-lg transition-all duration-300 hover:-translate-y-[1px]"
        >
          Explore Demo
          <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <ArrowUpRight
              size={14}
              className="group-hover:rotate-45 transition-transform"
            />
          </span>
        </button>

     
      </div>

      <DemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={() => navigate("/demo")}
      />
    </main>
  );
}