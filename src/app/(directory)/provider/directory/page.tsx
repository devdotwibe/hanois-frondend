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
    let cancelled = false
    const fetchProviders = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) {
          setProviders(json?.data?.providers || [])
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Fetch error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProviders()
    return () => { cancelled = true }
  }, [])

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
