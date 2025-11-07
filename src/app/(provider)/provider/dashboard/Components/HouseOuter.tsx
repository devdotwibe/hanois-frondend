"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

const HouseOuter: React.FC = () => {
  const [providerId, setProviderId] = useState<number | null>(null);

  useEffect(() => {
    // Example: assuming user data is stored in localStorage as JSON
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed?.id) {
          setProviderId(Number(parsed.id));
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  if (!providerId) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <HouseCard
        logo={logo1}
        name="American House Improvements Inc."
        providerId={providerId} // dynamically from logged-in user
      />
    </div>
  );
};

export default HouseOuter;
