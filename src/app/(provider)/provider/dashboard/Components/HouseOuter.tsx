"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

const HouseOuter = () => {
  const [providerId, setProviderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Adjust this based on how your backend encodes the token:
        const id = payload.providerId || payload.id || payload.userId;
        if (id) setProviderId(Number(id));
      } catch (err) {
        console.error("Invalid token format:", err);
      }
    }
  }, []);

  if (!providerId) {
    return <p>Loading provider profile...</p>;
  }

  return (
    <div>
      <HouseCard
        logo={logo1}
        name="Your Company"
        providerId={providerId}
      />
    </div>
  );
};

export default HouseOuter;
