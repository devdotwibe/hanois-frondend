import React, { useEffect, useState } from 'react';

const DirectorySidebar = ({ onCategoryChange = () => {}, selectedCategory = 'All' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://hanois.dotwibe.com/api/api/categories');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setCategories(json || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className='filter-container'>
      <h2 className='filter-title'>FILTER BY</h2>
      {/* Service Category Section */}
      <div className='filter-section'>
        <p className='section-label'>Service category</p>
        <div className='select-wrapper'>
          <select
            className='category-select'
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)} // Trigger the callback to change selected category
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Style Section (optional section for additional filters) */}
      <div className='filter-section'>
        <p className='section-label'>Style</p>
        {/* Example checkbox filters */}
        <label className='checkbox-label'>
          <input type="checkbox" className='hidden-checkbox' />
          <span className='custom-checkbox checked'>
            <span className='checkmark'>✓</span>
          </span>
          <span>Modern</span>
        </label>
        <label className='checkbox-label'>
          <input type="checkbox" className='hidden-checkbox' />
          <span className='custom-checkbox checked'>
            <span className='checkmark'>✓</span>
          </span>
          <span>Classic</span>
        </label>
        {/* More styles can be added here */}
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