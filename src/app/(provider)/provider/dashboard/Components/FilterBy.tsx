"use client";

import React, { useState, useEffect } from "react";
import { API_URL } from "@/config";

interface ServiceItem {
  id: number;
  name: string;
}

interface FilterByProps {
  onFilterChange: (selectedIds: number[]) => void;
}

const FilterBy: React.FC<FilterByProps> = ({ onFilterChange }) => {
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  // Load services once
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await fetch(`${API_URL}/users/public-services`);
        const json = await response.json();
        setAllServices(json.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchAllServices();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (!selectedId) return;

    const selectedService = allServices.find((s) => s.id === selectedId);
    if (!selectedService) return;

    if (!selectedServices.some((s) => s.id === selectedId)) {
      const updated = [...selectedServices, selectedService];
      setSelectedServices(updated);

      onFilterChange(updated.map((s) => s.id));
    }

    e.target.value = "";
  };

  const handleRemoveTag = (id: number) => {
    const updated = selectedServices.filter((s) => s.id !== id);
    setSelectedServices(updated);

    onFilterChange(updated.map((s) => s.id));
  };

  return (
    <div className="filter-container">
      <h2 className="filter-title">FILTER BY</h2>

      <div className="filter-section">
        <p className="section-label">Service category</p>

        <div className="select-wrapper form-grp">
          <select onChange={handleSelectChange} value="">
            <option value="">Categories</option>
            {allServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tags-container">
        {selectedServices.map((service) => (
          <div key={service.id} className="tag">
            <span className="tag-text">{service.name}</span>
            <button
              className="tag-close"
              onClick={() => handleRemoveTag(service.id)}
              aria-label={`Remove ${service.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBy;

