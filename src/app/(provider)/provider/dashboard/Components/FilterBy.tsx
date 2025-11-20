'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/config";

interface ServiceItem {
  id: number;
  name: string;
}

interface FilterByProps {
  selectedServices?: ServiceItem[];
  setSelectedServices?: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

const FilterBy = ({
  selectedServices,
  setSelectedServices,
}: FilterByProps) => {

  // 🔥 FIX: Ensure safe values
  const safeSelected = Array.isArray(selectedServices) ? selectedServices : [];
  const safeSetter =
    typeof setSelectedServices === "function" ? setSelectedServices : () => {};

  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };

    loadServices();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (!selectedId) return;

    const service = services.find((s) => s.id === selectedId);
    if (!service) return;

    if (!safeSelected.some((s) => s.id === service.id)) {
      safeSetter((prev) => [...prev, service]);
    }

    e.target.value = "";
  };

  const removeTag = (id: number) => {
    safeSetter((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="filter-container">
      <h2 className="filter-title">FILTER BY</h2>

      <div className="filter-section">
        <p className="section-label">Service category</p>

        <div className="select-wrapper form-grp">
          <select onChange={handleSelect}>
            <option value="">Categories</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAGS */}
      <div className="tags-container">
        {safeSelected.map((service) => (
          <div key={service.id} className="tag">
            <span className="tag-text">{service.name}</span>
            <button className="tag-close" onClick={() => removeTag(service.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBy;
