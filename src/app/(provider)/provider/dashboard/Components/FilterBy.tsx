'use client'

import React, { useState, useEffect } from "react";
import { API_URL } from "@/config";

interface ServiceItem {
  id: number;
  name: string;
}

const FilterBy = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  // Handle selection change from dropdown
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedService = services.find(s => s.id === selectedId);
    
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
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
