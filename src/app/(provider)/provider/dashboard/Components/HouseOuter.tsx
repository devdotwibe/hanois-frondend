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
        // no initialDescription / initialImagePath passed on purpose
      />
    </div>
  );
};

export default HouseOuter;
