import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function APICredentials({ onNext, onPrev, data, setData }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(null);

  // Generate mock API keys
  const apiKey = data.apiKey || `vynqe_pk_live_${Math.random().toString(36).substr(2, 20)}`;
  const apiSecret = data.apiSecret || `vynqe_sk_live_${Math.random().toString(36).substr(2, 30)}`;
  const webhookSecret = data.webhookSecret || `whsec_${Math.random().toString(36).substr(2, 28)}`;

  if (!data.apiKey) {
    setData({
      ...data,
      apiKey,
      apiSecret,
      webhookSecret,
    });
  }

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="text-green-600" size={24} />
          <h1 className="text-3xl font-bold text-gray-900">API Credentials</h1>
        </div>
        <p className="text-gray-600">Keep these secure! Never commit to git or logs.</p>
      </div>

      <div className="space-y-6">
        {/* Public API Key */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                PUBLIC
              </span>
              API Key
            </label>
            <button
              onClick={() => handleCopy(apiKey, "apiKey")}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              {copied === "apiKey" ? (
                <CheckCircle className="text-green-600" size={18} />
              ) : (
                <Copy size={18} className="text-gray-600" />
              )}
            </button>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm break-all">
            {apiKey}
          </div>
        </div>

        {/* Secret Key */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">
                SECRET
              </span>
              Secret Key
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-2 hover:bg-gray-200 rounded transition"
              >
                {showSecret ? (
                  <EyeOff size={18} className="text-gray-600" />
                ) : (
                  <Eye size={18} className="text-gray-600" />
                )}
              </button>
              <button
                onClick={() => handleCopy(apiSecret, "apiSecret")}
                className="p-2 hover:bg-gray-200 rounded transition"
              >
                {copied === "apiSecret" ? (
                  <CheckCircle className="text-green-600" size={18} />
                ) : (
                  <Copy size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm">
            {showSecret ? (
              <span className="break-all">{apiSecret}</span>
            ) : (
              <span className="text-gray-400">••••••••••••••••••••••••••••••••</span>
            )}
          </div>
        </div>

        {/* Webhook Secret */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">
                WEBHOOK
              </span>
              Webhook Secret
            </label>
            <button
              onClick={() => handleCopy(webhookSecret, "webhook")}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              {copied === "webhook" ? (
                <CheckCircle className="text-green-600" size={18} />
              ) : (
                <Copy size={18} className="text-gray-600" />
              )}
            </button>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm break-all">
            {webhookSecret}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Important:</strong> These credentials are sensitive. Never share them or
            commit them to version control. Treat them like passwords.
          </p>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
