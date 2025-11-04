"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function SettingsPage() {
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch admin email on mount
  useEffect(() => {
    async function fetchEmail() {
      try {
        const res = await axios.get(`${API_URL}settings/admin-email`);
        setContactEmail(res.data?.adminEmail || "");
      } catch (error) {
        console.error("Failed to fetch admin email", error);
        setMessage("❌ Failed to load current email");
      }
    }
    fetchEmail();
  }, []);

  // Save admin email
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}settings/admin-email`,
        { email: contactEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status >= 200 && res.status < 300) {
        setMessage("✅ Contact email saved successfully!");
      } else {
        setMessage("❌ Failed to save contact email.");
      }
    } catch (error) {
      console.error("Error saving email:", error);
      setMessage("❌ Error saving contact email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label htmlFor="contactEmail" className="block font-medium mb-2">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter contact email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
