"use client";
import React, { useState, useMemo, useEffect } from 'react'
import Intro from '../Components/Intro'
import RepeatHouseDiv from '../Components/RepeatHouseDiv'
import DirectorySidebar from '../Components/DirectorySidebar'

const API_URL = 'https://hanois.dotwibe.com/api/api/providers'

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState(() => {
    const cachedProviders = localStorage.getItem('providers')
    return cachedProviders ? JSON.parse(cachedProviders) : []
  })
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // number of items per page

  // Fetch data if no cached data exists
  useEffect(() => {
    if (providers.length === 0) {
      const fetchProviders = async () => {
        try {
          const res = await fetch(API_URL)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const json = await res.json()
          setProviders(json?.data?.providers || [])
          localStorage.setItem('providers', JSON.stringify(json?.data?.providers || []))
        } catch (err) {
          setError(err.message || 'Fetch error')
        }
      }

      fetchProviders()
    }
  }, [providers])

  // Filtered data based on search and category
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return providers.filter(p => {
      const hay = `${p.name || ''} ${p.service || ''} ${p.location || ''}`.toLowerCase()
      if (q && !hay.includes(q)) return false
      if (selectedCategory !== 'All') {
        return (p.service || '').toLowerCase().includes(selectedCategory.toLowerCase())
      }
      return true
    })
  }, [providers, query, selectedCategory])

  // Pagination: slice the filtered data based on current page
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }, [filtered, currentPage])

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
            total={filtered.length}
          />

          {error && <p style={{color:'red', padding: '1rem'}}>Error: {error}</p>}
          {paginatedProviders.length === 0 && (
            <p style={{padding: '1rem'}}>No providers match your search.</p>
          )}

          {paginatedProviders.map(provider => (
            <RepeatHouseDiv key={provider.id} provider={provider} />
          ))}

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
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
