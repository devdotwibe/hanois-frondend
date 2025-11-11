"use client";
import React, { useEffect, useState, useMemo } from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'

const API_URL = 'https://hanois.dotwibe.com/api/api/providers'

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const controller = new AbortController()
    const fetchProviders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(API_URL, { signal: controller.signal, cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setProviders(json?.data?.providers || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Fetch error')
          setProviders([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (providers || []).filter(p => {
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
            total={(providers || []).length}
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
