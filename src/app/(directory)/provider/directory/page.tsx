"use client";
import React, { useState, useMemo } from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'
import { API_URL } from "@/config";

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Check if data is already cached in localStorage
  const cachedData = localStorage.getItem('providers')
  const lastFetch = localStorage.getItem('lastFetch')

  // If data exists in localStorage and is not too old, use it
  if (cachedData && lastFetch && Date.now() - lastFetch < 3600000) { // 1 hour cache
    setProviders(JSON.parse(cachedData))
    setLoading(false)
  } else {
    // If no cache or cache is too old, fetch from API
    const fetchProviders = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setProviders(json?.data?.providers || [])
        setError(null)

        // Cache the providers data in localStorage for 1 hour
        localStorage.setItem('providers', JSON.stringify(json?.data?.providers || []))
        localStorage.setItem('lastFetch', Date.now().toString())
      } catch (err) {
        setError(err.message || 'Fetch error')
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }

  // simple derived list based on search + category (category is placeholder because API provides category IDs only)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return providers.filter(p => {
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
            total={providers.length}
          />

          {loading && <p style={{padding: '1rem'}}>Loading providers...</p>}
          {error && <p style={{color:'red', padding: '1rem'}}>Error: {error}</p>}
          {!loading && !error && filtered.length === 0 && (
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
