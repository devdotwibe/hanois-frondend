import React from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

const HouseOuter = () => {
  return (
    <div>
      <HouseCard
        logo={logo1}
        name="American House Improvements Inc."
        providerId={5}
        initialDescription="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
        initialImagePath="/uploads/1762501777711.jpg"
      />
    </div>
  );
};

export default HouseOuter;
