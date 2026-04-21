import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle } from "lucide-react";

export default function DataMapping({ onNext, onPrev, data, setData }) {
  const [userFields, setUserFields] = useState(data.userFields || {});
  const [productFields, setProductFields] = useState(data.productFields || {});
  const [eventsToTrack, setEventsToTrack] = useState(data.eventsToTrack || []);
  const [testStatus, setTestStatus] = useState("");

  const userFieldOptions = [
    "user_id",
    "email",
    "name",
    "account_type",
    "industry",
    "company",
    "created_at",
  ];
  const productFieldOptions = [
    "product_id",
    "product_name",
    "category",
    "price",
    "tags",
  ];
  const eventOptions = [
    "page_view",
    "click",
    "time_spent",
    "form_submission",
    "scroll_depth",
    "video_play",
  ];

  const handleUserFieldChange = (field, value) => {
    setUserFields({ ...userFields, [field]: value });
  };

  const handleProductFieldChange = (field, value) => {
    setProductFields({ ...productFields, [field]: value });
  };

  const toggleEvent = (event) => {
    setEventsToTrack((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleTestIntegration = () => {
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
      setTimeout(() => setTestStatus(""), 2000);
    }, 2000);
  };

  const handleContinue = () => {
    if (
      Object.values(userFields).some((v) => !v) ||
      Object.values(productFields).some((v) => !v) ||
      eventsToTrack.length === 0
    ) {
      alert("Please fill in all fields and select at least one event");
      return;
    }
    setData({ ...data, userFields, productFields, eventsToTrack });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Map Your Data</h1>
        <p className="text-gray-600 mt-2">
          Tell us how to read your data structure
        </p>
      </div>

      <div className="space-y-8">
        {/* USER FIELDS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Fields
          </h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {["user_id", "email", "account_type", "industry"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={userFields[field] || ""}
                  onChange={(e) =>
                    handleUserFieldChange(field, e.target.value)
                  }
                  placeholder={`e.g., ${field}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT FIELDS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Product Fields
          </h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {["product_id", "product_name", "category"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={productFields[field] || ""}
                  onChange={(e) =>
                    handleProductFieldChange(field, e.target.value)
                  }
                  placeholder={`e.g., ${field}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* EVENTS TO TRACK */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events to Track
          </h3>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {eventOptions.map((event) => (
              <label key={event} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventsToTrack.includes(event)}
                  onChange={() => toggleEvent(event)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {event.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* TEST BUTTON */}
        <button
          onClick={handleTestIntegration}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition duration-200 ${
            testStatus === "success"
              ? "bg-green-600 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {testStatus === "testing" && "Testing..."}
          {testStatus === "success" && (
            <>
              <CheckCircle size={20} />
              Integration Successful!
            </>
          )}
          {!testStatus && (
            <>
              <Zap size={20} />
              Test Integration
            </>
          )}
        </button>

        {/* INFO BOX */}
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
          <p className="text-sm text-blue-900">
            ℹ️ These mappings help us understand your data structure. Make sure
            your backend sends data in the same format.
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
          onClick={handleContinue}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
