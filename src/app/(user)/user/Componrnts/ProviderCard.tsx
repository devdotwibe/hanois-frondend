"use client";
import React from "react";
import { IMG_URL } from "@/config";

interface Company {
  id: number;
  image?: string;
  name?: string;
}

interface ProviderCardProps {
  company: Company;
  isSelected: boolean;
  onSelect: (company: Company, checked: boolean) => void;
  isRemovable?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  company,
  isSelected,
  onSelect,
  isRemovable = false,
}) => {
  const handleCheckboxChange = () => {
    onSelect(company, !isSelected);
  };

  const HandleNavigate = (id: number) => {
    window.open(`/provider-detail/${id}`, "_blank");
  };

  return (
    <div className={`company-card ${isSelected ? "active" : ""}`}>
      <div className="company-left">
        {!isRemovable ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            style={{
              marginRight: "10px",
              transform: "scale(1.2)",
              cursor: "pointer",
            }}
          />
        ) : (
          <button
            className="remove-btn"
            onClick={() => onSelect(company, false)}
          >
            ✕
          </button>
        )}

        {company.image && (
          <img
            src={`${IMG_URL}${company.image}`}
            alt={company.name || "Company logo"}
            width={70}
            height={70}
            className="company-logo"
          />
        )}

        <div className="company-info">
          <h4>{company.name}</h4>
        </div>
      </div>

      <div className="company-right">
        <div className="with-btn">
          <button
            type="button"
            className="view-btn"
            onClick={() => HandleNavigate(company.id)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
