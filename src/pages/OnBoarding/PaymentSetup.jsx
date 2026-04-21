import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, AlertCircle } from "lucide-react";

export default function PaymentSetup({ onNext, onPrev, data, setData }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, payment: { ...data.payment, [name]: value } });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payment = data.payment || {};
    if (
      !payment.cardNumber ||
      !payment.expiry ||
      !payment.cvc ||
      !payment.billingEmail
    ) {
      setError("All payment fields are required");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Method</h1>
        <p className="text-gray-600 mt-2">Add a card to activate your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plan Info */}
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
          <p className="text-sm text-gray-700">
            Plan: <span className="font-semibold capitalize">{data.plan}</span>
          </p>
          <p className="text-sm text-gray-700">
            Amount: <span className="font-semibold">
              {data.plan === "starter"
                ? "Free"
                : data.plan === "professional"
                ? "$500/month"
                : "Custom"}
            </span>
          </p>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="cardNumber"
              value={data.payment?.cardNumber || ""}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiry"
              value={data.payment?.expiry || ""}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              name="cvc"
              value={data.payment?.cvc || ""}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Billing Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Email
          </label>
          <input
            type="email"
            name="billingEmail"
            value={data.payment?.billingEmail || ""}
            onChange={handleChange}
            placeholder="billing@company.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Address
          </label>
          <input
            type="text"
            name="billingAddress"
            value={data.payment?.billingAddress || ""}
            onChange={handleChange}
            placeholder="123 Main St, City, State ZIP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={data.payment?.agreeTerms || false}
            onChange={(e) =>
              setData({
                ...data,
                payment: { ...data.payment, agreeTerms: e.target.checked },
              })
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            I agree to the Terms of Service and will pay the recurring charge
          </span>
        </label>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Continue →
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        💳 Test card: 4242 4242 4242 4242 | Any future date | Any CVC
      </div>
    </motion.div>
  );
}
