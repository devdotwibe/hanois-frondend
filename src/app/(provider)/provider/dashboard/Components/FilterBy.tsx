'use client'

import React, { useState, useEffect } from "react";
import { API_URL } from "@/config";

interface ServiceItem {
  id: number;
  name: string;
}

const FilterBy = () => {
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  // Fetch all service details from new API endpoint returning {id, name} list
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await fetch(`${API_URL}/users/public-services`);
        const json = await response.json();
        setAllServices(json.data); // data is array of {id, name}
      } catch (error) {
        console.error("Failed to fetch services details:", error);
      }
    };
    fetchAllServices();
  }, []);

  // Handle selection change from dropdown
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedService = allServices.find(s => s.id === selectedId);
    if (
      selectedService &&
      !selectedServices.some(s => s.id === selectedService.id)
    ) {
      setSelectedServices(prev => [...prev, selectedService]);
    }
  };

  // Handle tag removal
  const handleRemoveTag = (id: number) => {
    setSelectedServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="filter-container">
        <h2 className="filter-title">FILTER BY</h2>

        {/* Service Category Section */}
        <div className="filter-section">
          <p className="section-label">Service category</p>
          <div className="select-wrapper form-grp">
            <select onChange={handleSelectChange} value="">
              <option value="">Categories</option>
              {allServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Render tags based on selectedServices */}
        <div className="tags-container">
          {selectedServices.map(service => (
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
    </div>
  );
};

export default FilterBy;
