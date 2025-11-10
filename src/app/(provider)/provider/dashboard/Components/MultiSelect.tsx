"use client";

import React, { useState } from "react";
import "./MultiSelect.css";

interface Category {
  id: string | number;
  name: string;
}

interface MultiSelectProps {
  label: string;
  categoriesList: Category[];
  onChange?: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  categoriesList,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleSelect = (id: string) => {
    setSelected((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      if (onChange) onChange(newSelection);
      return newSelection;
    });
  };

  const handleRemoveTag = (id: string) => {
    setSelected((prev) => prev.filter((item) => item !== id));
    if (onChange) onChange(selected.filter((item) => item !== id));
  };

  return (
    <div className="form-grp select-grp">
      <label>{label}</label>

      <div className="multi-select" onClick={handleToggle}>
        <div className="selected-tags">
          {selected.length > 0 ? (
            selected.map((id) => {
              const cat = categoriesList.find((c) => c.id.toString() === id);
              return (
                <span key={id} className="tag">
                  {cat?.name}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(id);
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className="placeholder">Select categories...</span>
          )}
        </div>
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <ul className="dropdown">
          {categoriesList.length > 0 ? (
            categoriesList.map((cat) => (
              <li key={cat.id} className="dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(cat.id.toString())}
                    onChange={() => handleSelect(cat.id.toString())}
                  />
                  {cat.name}
                </label>
              </li>
            ))
          ) : (
            <li className="dropdown-item disabled">Loading categories...</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
