// components/HouseOuter.tsx
import React from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

type HouseOuterProps = {
  providerId: number; // required now
};

const HouseOuter: React.FC<HouseOuterProps> = ({ providerId }) => {
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
