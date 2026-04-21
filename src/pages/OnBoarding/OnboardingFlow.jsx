import React, { useState } from "react";
import { motion } from "framer-motion";
import Signup from "./Signup";
import KYC from "./KYC";
import PlanSelection from "./PlanSelection";
import PaymentSetup from "./PaymentSetup";
import APICredentials from "./APICredentials";
import IntegrationSetup from "./IntegrationSetup";
import DataMapping from "./DataMapping";
import OnboardingDashboard from "./OnboardingDashboard";

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});

  const steps = [
    { title: "Sign Up", component: Signup },
    { title: "Company Verification", component: KYC },
    { title: "Choose Plan", component: PlanSelection },
    { title: "Payment", component: PaymentSetup },
    { title: "API Credentials", component: APICredentials },
    { title: "Integration", component: IntegrationSetup },
    { title: "Data Mapping", component: DataMapping },
    { title: "Welcome", component: OnboardingDashboard },
  ];

  const CurrentComponent = steps[step].component;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition duration-200 ${
                  idx === step
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : idx < step
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {idx < step ? "✓" : idx + 1}
              </motion.div>
              <label className="text-xs font-semibold text-gray-700 mt-2 text-center">
                {s.title}
              </label>
            </div>
          ))}
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Step <span className="font-bold text-blue-600">{step + 1}</span> of{" "}
            <span className="font-bold">{steps.length}</span>
          </p>
        </div>
      </div>

      {/* Component Container */}
      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {step === steps.length - 1 ? (
          <CurrentComponent data={data} onRestart={handleRestart} />
        ) : (
          <CurrentComponent
            onNext={handleNext}
            onPrev={handlePrev}
            data={data}
            setData={setData}
          />
        )}
      </motion.div>
    </div>
  );
}
