"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeTag = (id: string) => {
    onChange(selected.filter((item) => item !== id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-grp select-grp" ref={dropdownRef}>
      <label>{label}</label>

      <div className="multi-select-input" onClick={toggleDropdown}>
        <div className="tags-container">
          {selected.length === 0 && <span className="placeholder"></span>}
          {selected.map((id) => {
            const option = options.find((opt) => opt.id === id);
            return (
              <span key={id} className="tag">
                {option?.name}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(id);
                  }}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="dropdown">
          {options.length > 0 ? (
            options.map((option) => (



              // <label key={option.id} className="dropdown-option">
              //   <input
              //     type="checkbox"
              //     checked={selected.includes(option.id)}
              //     onChange={() => handleSelect(option.id)}
              //   />
              //   {option.name}
              // </label>



              <label
  key={option.id}
  className={`dropdown-option ${
    selected.includes(option.id) ? "selected" : ""
  }`}
>
  <input
    type="checkbox"
    checked={selected.includes(option.id)}
    onChange={() => handleSelect(option.id)}
  />
  {option.name}
</label>







            ))
          ) : (
            <div className="dropdown-option disabled">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
