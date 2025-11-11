import React from 'react'

const FilterBy = () => {
  return (
    <div>

        <div className='filter-container'>
      <h2 className='filter-title'>FILTER BY</h2>

      {/* Service Category Section */}
      <div className='filter-section'>
        <p className='section-label'>Service category</p>
        <div className='select-wrapper form-grp'>
          <select
          
          >
            <option value="All">Categories</option>
            <option value="Design">Design</option>
            <option value="Construction">Construction</option>
           
          </select>
        </div>
      </div>

  
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

     
    </div>











      
    </div>
  )
}

export default FilterBy
