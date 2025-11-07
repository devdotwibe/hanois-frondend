// components/HouseOuter.tsx
import React from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

type HouseOuterProps = {
  providerId?: number; // now dynamic via prop
};

const HouseOuter: React.FC<HouseOuterProps> = ({ providerId = 5 }) => {
  // default stays 5 if caller doesn't provide one
  return (
    <div>
      <HouseCard
        logo={logo1}
        name="American House Improvements Inc."
        providerId={providerId}
        // no initialDescription / initialImagePath passed on purpose
      />
    </div>
  );
};

export default HouseOuter;
