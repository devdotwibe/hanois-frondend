
import React from 'react';

const DirectorySidebar = () => {
  return (
    <div className='filter-container'>
      <h2 className='filter-title'>FILTER BY</h2>

      {/* Service Category Section */}
      <div className='filter-section'>
        <p className='section-label'>Service category</p>
        <div className='select-wrapper'>
          <select className='category-select' defaultValue="Categories">
            <option value="Categories">Categories</option>
            <option value="Design">Design</option>
            <option value="Construction">Construction</option>
            <option value="Renovation">Renovation</option>
          </select>
        </div>
      </div>

      {/* Selected Tags */}
      <div className='tags-container'>
        <div className='tag'>
          <span className='tag-text'>Design</span>
          <button className='tag-close'>✕</button>
        </div>
        <div className='tag'>
          <span className='tag-text'>Design</span>
          <button className='tag-close'>✕</button>
        </div>
      </div>

      {/* Style Section */}
      <div className='filter-section'>
        <p className='section-label'>Style</p>
        
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

        <label className='checkbox-label'>
          <input type="checkbox" className='hidden-checkbox' />
          <span className='custom-checkbox'>
            <span className='checkmark'>✓</span>
          </span>
          <span>Urbanistic</span>
        </label>

        <label className='checkbox-label'>
          <input type="checkbox" className='hidden-checkbox' />
          <span className='custom-checkbox'>
            <span className='checkmark'>✓</span>
          </span>
          <span>Futurism</span>
        </label>
      </div>
    </div>
  );
};

export default DirectorySidebar;