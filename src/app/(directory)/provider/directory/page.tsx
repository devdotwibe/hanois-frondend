"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Intro from '../Components/Intro';
import RepeatHouseDiv from '../Components/RepeatHouseDiv';
import DirectorySidebar from '../Components/DirectorySidebar';

const API_URL = 'https://hanois.dotwibe.com/api/api/providers';
const ITEMS_PER_PAGE = 10;

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState(() => {
    const cached = localStorage.getItem('providers');
    return cached ? JSON.parse(cached) : [];
  });
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Flag to indicate server-side filtering was used
  const [serverFiltered, setServerFiltered] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = API_URL;
        let usedServerFilter = false;
        if (selectedCategory && selectedCategory !== 'All') {
          url = `${API_URL}?category=${encodeURIComponent(selectedCategory)}`;
          usedServerFilter = true;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // safe access, fallback to []
        const newProviders = json?.data?.providers || [];
        console.log('Fetched providers', newProviders);
        setProviders(newProviders);
        localStorage.setItem('providers', JSON.stringify(newProviders));
        setServerFiltered(Boolean(usedServerFilter));
        // whenever we get a fresh provider list, reset page to 1
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || 'Fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [selectedCategory]);

  // Reset page to 1 when query changes (client-side search) or providers length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, providers.length]);

  // Filter data: if serverFiltered is true, don't apply category-based filtering again.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers.filter(p => {
      const hay = `${p.name || ''} ${p.service || ''} ${p.location || ''}`.toLowerCase();
      if (q && !hay.includes(q)) return false;

      // If server already filtered by category, skip client-side category check
      if (selectedCategory !== 'All' && !serverFiltered) {
        // only apply client-side service-match if server didn't filter
        return (p.service || '').toLowerCase().includes(selectedCategory.toLowerCase());
      }
      return true;
    });
  }, [providers, query, selectedCategory, serverFiltered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  // ensure currentPage never exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  return (
    <div className='spd-outer'>
      <div className="sidebar-div1">
        <DirectorySidebar
          onCategoryChange={(cat) => setSelectedCategory(cat)}
          selectedCategory={selectedCategory}
        />
        <div className="spd-outer1">
          <Intro
            query={query}
            onQueryChange={setQuery}
            total={filtered.length}
          />
          {loading && <p style={{ padding: '1rem' }}>Loading providers…</p>}
          {error && <p style={{ color: 'red', padding: '1rem' }}>Error: {error}</p>}
          {!loading && !error && paginatedProviders.length === 0 && (
            <p style={{ padding: '1rem' }}>No providers match your search.</p>
          )}
          {paginatedProviders.map(provider => (
            <RepeatHouseDiv key={provider.id} provider={provider} />
          ))}

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDirectory;


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
