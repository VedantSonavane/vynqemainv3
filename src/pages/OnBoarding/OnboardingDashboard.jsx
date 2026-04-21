import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  BookOpen,
  Zap,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function OnboardingDashboard({ data, onRestart }) {
  const stats = [
    { label: "API Calls Today", value: "0", icon: "📊" },
    { label: "Predictions Made", value: "0", icon: "🤖" },
    { label: "Active Integrations", value: data.integration ? "1" : "0", icon: "🔗" },
  ];

  const nextSteps = [
    {
      complete: true,
      title: "Account Created",
      description: "Your account is ready to go",
    },
    {
      complete: true,
      title: "Plan Selected",
      description: `You're on the ${data.plan} plan`,
    },
    {
      complete: true,
      title: "API Keys Generated",
      description: "Store them securely",
    },
    {
      complete: false,
      title: "Send First API Request",
      description: "Test your integration",
    },
    {
      complete: false,
      title: "Set Up Webhooks",
      description: "Real-time notifications (optional)",
    },
  ];

  const resources = [
    { icon: BookOpen, label: "API Documentation", href: "#" },
    { icon: Zap, label: "Code Examples", href: "#" },
    { icon: Zap, label: "Webhook Events", href: "#" },
    { icon: MessageSquare, label: "Support Chat", href: "#" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2 }}
          className="inline-block mb-4"
        >
          <CheckCircle className="text-green-600" size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Vynqe!
        </h1>
        <p className="text-gray-600">Your API platform is ready to use</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
        <div className="space-y-4">
          {nextSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="mt-1">
                {step.complete ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Useful Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <a
                key={idx}
                href={resource.href}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition duration-200 border border-gray-200"
              >
                <Icon className="text-blue-600" size={24} />
                <div>
                  <span className="font-semibold text-gray-900">
                    {resource.label}
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-gray-400 ml-1 inline"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4 border-green-600">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Setup Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Plan</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {data.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Integration</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {data.integration}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Company</p>
            <p className="text-lg font-semibold text-gray-900">
              {data.companyName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-900">{data.email}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Go to Dashboard
        </button>
        <button
          onClick={onRestart}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
        >
          Start Over
        </button>
      </div>
    </motion.div>
  );
}
