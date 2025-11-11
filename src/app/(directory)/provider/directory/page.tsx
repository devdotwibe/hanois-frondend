"use client";
import React, { useMemo, useState } from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'

/**
 * NOTE: This component no longer performs data fetching.
 * Pass `providers` into this component from a parent (server/page) or from whatever caller
 * is responsible for fetching (e.g. getServerSideProps, an async server component, or a hook).
 */

const ServiceProviderDirectory = ({ providers = [] }) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // derived list based on search + category (category is placeholder because API provides category IDs only)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (providers || []).filter(p => {
      // search by name, service, location
      const hay = `${p.name || ''} ${p.service || ''} ${p.location || ''}`.toLowerCase()
      if (q && !hay.includes(q)) return false
      if (selectedCategory !== 'All') {
        // crude check: see if category name appears in service text
        return (p.service || '').toLowerCase().includes(selectedCategory.toLowerCase())
      }
      return true
    })
  }, [providers, query, selectedCategory])

  return (
    <div className='spd-outer'>
      <div className="sidebar-div1">
        <DirectorySidebar
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        <div className="spd-outer1">
          <Intro
            query={query}
            onQueryChange={setQuery}
            total={(providers || []).length}
          />

          {(!providers || providers.length === 0) && (
            <p style={{padding: '1rem'}}>No providers available.</p>
          )}

          {filtered.length === 0 && (providers && providers.length > 0) && (
            <p style={{padding: '1rem'}}>No providers match your search.</p>
          )}

          {filtered.map(provider => (
            <RepeatHouseDiv key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ServiceProviderDirectory


// import React from 'react'
// import Intro from '../Components/Intro'
// import RepeatHouseDiv from '../Components/RepeatHouseDiv'
// import DirectorySidebar from '../Components/DirectorySidebar'




// const ServiceProviderDirectory = () => {
//   return (
//     <div className='spd-outer'>




//       <div className="sidebar-div1">
//         <DirectorySidebar />

//          <div className="spd-outer1">
//         <Intro />
//         <RepeatHouseDiv />
//         <RepeatHouseDiv />

//        </div>

//       </div>


      
//     </div>
//   )
// }

// export default ServiceProviderDirectory
