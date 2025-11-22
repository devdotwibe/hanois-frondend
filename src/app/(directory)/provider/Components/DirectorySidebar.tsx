import React, { useState, useEffect } from 'react';
import { API_URL } from "@/config";

const DirectorySidebar = ({
  onCategoryChange = () => {},
  selectedCategory = 'All',
  onStylesChange = () => {},
  selectedStyles = [], // optional: array of design names or ids
}) => {
  const [categories, setCategories] = useState([]);
  const [designs, setDesigns] = useState([]); // dynamic styles (designs)
  const [stylesSelected, setStylesSelected] = useState(() => {
    // normalize incoming selectedStyles prop to a Set for fast lookup
    return new Set(selectedStyles || []);
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories and designs in parallel
    const fetchCategories = fetch(`${API_URL}categories`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Categories HTTP ${res.status}`);
        const json = await res.json();
        const cats = json?.data?.categories ?? json?.data ?? json;
        return Array.isArray(cats) ? cats : [];
      });

    const fetchDesigns = fetch(`${API_URL}design`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Designs HTTP ${res.status}`);
        const json = await res.json();
        // API likely returns an array like the example you provided
        return Array.isArray(json) ? json : json?.data ?? [];
      });

    Promise.all([fetchCategories, fetchDesigns])
      .then(([cats, ds]) => {
        setCategories(cats);
        setDesigns(ds);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch');
      })
      .finally(() => setLoading(false));
  }, []);

  // Keep internal stylesSelected in sync if parent passes a new selectedStyles prop
useEffect(() => {
  const incoming = new Set(selectedStyles || []);
  const isSame =
    incoming.size === stylesSelected.size &&
    [...incoming].every((item) => stylesSelected.has(item));

  if (!isSame) {
    setStylesSelected(incoming);
  }
}, [selectedStyles]);

  const toggleStyle = (identifier) => {
    // identifier can be id or name depending on how parent prefers to identify styles.
    // We'll keep the value as design.name in the checkbox value for readability, but support
    // either if parent passes ids in selectedStyles.
    const next = new Set(stylesSelected);
    if (next.has(identifier)) next.delete(identifier);
    else next.add(identifier);
    setStylesSelected(next);

    // call parent with an array (convert Set to Array)
    // Provide both name list and id list might be useful — we'll send names first (most human-readable).
    // If you prefer ids, change to design.id where appropriate.
    onStylesChange(Array.from(next));
  };

  if (loading) return <p>Loading filters…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="filter-container">
      <h2 className="filter-title">FILTER BY</h2>

      <div className="filter-section">
        <p className="section-label">Service category</p>
        <div className="select-wrapper">
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Select service category"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => {
              const key = category.id ?? category.name;
              const name = category.name ?? category.title ?? String(category);
              return (
                <option key={key} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Dynamic Style / Design Section */}
      <div className="filter-section">
        <p className="section-label">Style</p>

        {designs.length === 0 ? (
          <p className="muted">No styles available</p>
        ) : (
          designs.map((design) => {
            // Choose a logical identifier for the checkbox value.
            // Using design.name as the user-facing identifier (from your sample JSON).
            // If you'd rather use ids for communication with the API, switch to design.id.
            const checkboxId = `design-${design.id}`;
            const value = design.name;
            const checked = stylesSelected.has(value) || stylesSelected.has(design.id);

            return (
              <label key={design.id} className="checkbox-label" htmlFor={checkboxId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  id={checkboxId}
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={checked}
                  onChange={() => toggleStyle(value)}
                  aria-checked={checked}
                />
                {/* Keep your custom-checkbox markup if you have custom CSS */}
                <span className={`custom-checkbox ${checked ? 'checked' : ''}`} aria-hidden="true">
                  <span className="checkmark">✓</span>
                </span>
                <span>{design.name}</span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DirectorySidebar;



// import React from 'react';

// const DirectorySidebar = () => {
//   return (
//     <div className='filter-container'>
//       <h2 className='filter-title'>FILTER BY</h2>

//       {/* Service Category Section */}
//       <div className='filter-section'>
//         <p className='section-label'>Service category</p>
//         <div className='select-wrapper'>
//           <select className='category-select' defaultValue="Categories">
//             <option value="Categories">Categories</option>
//             <option value="Design">Design</option>
//             <option value="Construction">Construction</option>
//             <option value="Renovation">Renovation</option>
//           </select>
//         </div>
//       </div>

//       {/* Selected Tags */}
//       <div className='tags-container'>
//         <div className='tag'>
//           <span className='tag-text'>Design</span>
//           <button className='tag-close'>✕</button>
//         </div>
//         <div className='tag'>
//           <span className='tag-text'>Design</span>
//           <button className='tag-close'>✕</button>
//         </div>
//       </div>

//       {/* Style Section */}
//       <div className='filter-section'>
//         <p className='section-label'>Style</p>
        
//         <label className='checkbox-label'>
//           <input type="checkbox" className='hidden-checkbox' />
//           <span className='custom-checkbox checked'>
//             <span className='checkmark'>✓</span>
//           </span>
//           <span>Modern</span>
//         </label>

//         <label className='checkbox-label'>
//           <input type="checkbox" className='hidden-checkbox' />
//           <span className='custom-checkbox checked'>
//             <span className='checkmark'>✓</span>
//           </span>
//           <span>Classic</span>
//         </label>

//         <label className='checkbox-label'>
//           <input type="checkbox" className='hidden-checkbox' />
//           <span className='custom-checkbox'>
//             <span className='checkmark'>✓</span>
//           </span>
//           <span>Urbanistic</span>
//         </label>

//         <label className='checkbox-label'>
//           <input type="checkbox" className='hidden-checkbox' />
//           <span className='custom-checkbox'>
//             <span className='checkmark'>✓</span>
//           </span>
//           <span>Futurism</span>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default DirectorySidebar;