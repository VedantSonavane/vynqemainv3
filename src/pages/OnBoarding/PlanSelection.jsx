import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

export default function PlanSelection({ onNext, onPrev, data, setData }) {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "100K API calls/month",
        "3 products",
        "1 user",
        "Email support",
        "Basic analytics",
      ],
      highlighted: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "$500",
      period: "/month",
      description: "For growing companies",
      features: [
        "5M API calls/month",
        "Unlimited products",
        "10 users",
        "Priority support",
        "Advanced analytics",
        "Custom SLA",
      ],
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      description: "For large scale operations",
      features: [
        "Unlimited API calls",
        "Unlimited products",
        "Unlimited users",
        "24/7 dedicated support",
        "Custom integrations",
        "Dedicated account manager",
      ],
      highlighted: false,
    },
  ];

  const handleSelectPlan = (planId) => {
    setData({ ...data, plan: planId });
  };

  const handleSubmit = () => {
    if (!data.plan) {
      alert("Please select a plan");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">
          Pick the right plan for your business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -4 }}
            onClick={() => handleSelectPlan(plan.id)}
            className={`p-6 rounded-lg cursor-pointer border-2 transition duration-200 ${
              data.plan === plan.id
                ? "border-blue-600 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            } ${plan.highlighted ? "ring-2 ring-blue-400" : ""}`}
          >
            {plan.highlighted && (
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  MOST POPULAR
                </span>
                <Zap size={20} className="text-yellow-500" />
              </div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-gray-600 text-sm">{plan.period}</span>
              )}
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                data.plan === plan.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {data.plan === plan.id ? "✓ Selected" : "Select"}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
