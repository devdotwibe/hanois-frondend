"use client";
import React from "react";
import CompanyCard from "./CompanyCard";

const ProposalCard = ({ proposals }: { proposals: any[] }) => {
  return (
    <div className="proposal-div">
      {proposals.length === 0 ? (
        <p>No proposals yet</p>
      ) : (
        proposals.map((item) => (
          <CompanyCard key={item.id} proposal={item} />
        ))
      )}
    </div>
  );
};

export default ProposalCard;
