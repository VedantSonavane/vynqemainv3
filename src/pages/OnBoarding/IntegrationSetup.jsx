import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Send, Copy } from "lucide-react";

export default function IntegrationSetup({ onNext, onPrev, data, setData }) {
  const [selectedIntegration, setSelectedIntegration] = useState(
    data.integration || "rest"
  );
  const [copied, setCopied] = useState(false);

  const integrations = [
    {
      id: "rest",
      name: "REST API",
      description: "Direct HTTP requests",
      icon: "🔌",
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Real-time event streaming",
      icon: "🔔",
    },
    {
      id: "sdk",
      name: "SDK",
      description: "Pre-built libraries",
      icon: "📦",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "No-code automation",
      icon: "⚡",
    },
  ];

  const codeSnippets = {
    rest: `curl -X POST https://api.vynqe.com/v1/predict \\
  -H "Authorization: Bearer ${data.apiKey || 'vynqe_pk_xxx'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "U123",
    "product_id": "ms-1",
    "time_spent": 250,
    "engagement_score": 0.92
  }'`,
    sdk: `import vynqe

client = vynqe.Client(api_key="${data.apiKey || 'vynqe_pk_xxx'}")

result = client.predict(
    user_id="U123",
    product_id="ms-1",
    time_spent=250,
    engagement_score=0.92
)

print(result.next_action)`,
    webhooks: `// Configure webhook endpoint
POST /webhooks/configure
{
  "url": "https://your-domain.com/webhooks/vynqe",
  "events": ["prediction.created", "error.occurred"],
  "secret": "${data.webhookSecret || 'whsec_xxx'}"
}`,
    zapier: `1. Search for Vynqe in Zapier
2. Click "Add to Zapier"
3. Authenticate with your API Key
4. Create zap with trigger "New Prediction"
5. Connect to any of 10k+ apps`,
  };

  const handleCopy = (snippet) => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelect = (integrationId) => {
    setSelectedIntegration(integrationId);
    setData({ ...data, integration: integrationId });
  };

  const handleContinue = () => {
    if (!selectedIntegration) {
      alert("Please select an integration method");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Choose Integration Method
        </h1>
        <p className="text-gray-600 mt-2">How do you want to integrate Vynqe?</p>
      </div>

      {/* Integration Selection Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            whileHover={{ y: -2 }}
            onClick={() => handleSelect(integration.id)}
            className={`p-4 rounded-lg cursor-pointer border-2 transition duration-200 ${
              selectedIntegration === integration.id
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-3xl mb-2">{integration.icon}</div>
            <h3 className="font-bold text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-600">{integration.description}</p>
            <div className="mt-3">
              <input
                type="radio"
                name="integration"
                value={integration.id}
                checked={selectedIntegration === integration.id}
                readOnly
                className="accent-blue-600"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Code Snippet */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code size={20} />
            <span className="font-semibold">
              {integrations.find((i) => i.id === selectedIntegration)?.name}{" "}
              Example
            </span>
          </div>
          <button
            onClick={() => handleCopy(codeSnippets[selectedIntegration])}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{codeSnippets[selectedIntegration]}</code>
        </pre>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg mb-8">
        <p className="text-sm text-blue-900">
          ℹ️ Your API key has been automatically inserted into this example. Replace it if
          this is production code or if you change your keys.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
