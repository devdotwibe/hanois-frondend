"use client";
import React from "react";
import CompanyCard from "./CompanyCard";
import proposalimg from "../../../../../public/images/get-listed-1.jpg";

const ProposalCard = () => {
  const companies = [
    {
      id: 1,
      logo: proposalimg, 
      name: "American House Improvements Inc.",
      price: "$900,000 - 1 million",
      date: "06.08.2023",
      duration: "1 year 10 months",
    },
    {
      id: 2,
      logo: proposalimg, 
      name: "American House Improvements Inc.",
      price: "$900,000 - 1 million",
      date: "06.08.2023",
      duration: "1 year 10 months",
    },
    
  ];

  return (
    <div className="proposal-div">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export default ProposalCard;
