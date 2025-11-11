"use client";
import React, { useState, useMemo, useEffect } from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'

const API_URL = 'https://hanois.dotwibe.com/api/api/providers'

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState(() => {
    // Try to get cached data from localStorage
    const cachedProviders = localStorage.getItem('providers')
    return cachedProviders ? JSON.parse(cachedProviders) : []
  })
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Fetch data if no cached data exists
  useEffect(() => {
    if (providers.length === 0) {
      const fetchProviders = async () => {
        try {
          const res = await fetch(API_URL)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json = await res.json()
          setProviders(json?.data?.providers || [])
          // Cache the data in localStorage
          localStorage.setItem('providers', JSON.stringify(json?.data?.providers || []))
        } catch (err) {
          setError(err.message || 'Fetch error')
        }
      }

      fetchProviders()
    }
  }, [providers])

  // simple derived list based on search + category
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return providers.filter(p => {
      // search by name, service, location
      const hay = `${p.name || ''} ${p.service || ''} ${p.location || ''}`.toLowerCase()
      if (q && !hay.includes(q)) return false
      if (selectedCategory !== 'All') {
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
            total={providers.length}
          />

          {error && <p style={{color:'red', padding: '1rem'}}>Error: {error}</p>}
          {filtered.length === 0 && (
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
