"use client";
import React from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

const HouseOuter: React.FC = () => {
  // Read directly at render time
  let providerId: number | null = null;

  if (typeof window !== "undefined") {
    try {
      // Option 1: user stored as JSON object
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id);
      } else {
        // Option 2: decode JWT token if user not found
        const token = localStorage.getItem("token");
        if (token) {
          const base64 = token.split(".")[1];
          const payload = JSON.parse(atob(base64));
          providerId = Number(payload?.provider_id || payload?.id || payload?.user_id);
        }
      }
    } catch (err) {
      console.error("Error getting provider ID:", err);
    }
  }

  // fallback if still missing
  providerId = providerId || 5;

  return (
    <div>
      <HouseCard
        logo={logo1}
        name="American House Improvements Inc."
        providerId={providerId}
      />
    </div>
  );
};

export default HouseOuter;
