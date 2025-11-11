"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Intro from '../Components/Intro';
import RepeatHouseDiv from '../Components/RepeatHouseDiv';
import DirectorySidebar from '../Components/DirectorySidebar';

const API_URL = 'https://hanois.dotwibe.com/api/api/providers';

const ServiceProviderDirectory = () => {
  const [providers, setProviders] = useState(() => {
    const cached = localStorage.getItem('providers');
    return cached ? JSON.parse(cached) : [];
  });
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Flag to indicate if the providers were fetched from the server or from cache
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

        const newProviders = json?.data?.providers || [];
        console.log('Fetched providers', newProviders);
        setProviders(newProviders);
        localStorage.setItem('providers', JSON.stringify(newProviders));
        setServerFiltered(Boolean(usedServerFilter));
      } catch (err) {
        setError(err.message || 'Fetch error');
      } finally {
        setLoading(false);
      }
    };

    // Fetch providers if no cached data exists
    if (!providers.length) {
      fetchProviders();
    }
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers.filter(p => {
      const hay = `${p.name || ''} ${p.service || ''} ${p.location || ''}`.toLowerCase();

      if (q && !hay.includes(q)) return false;

      // If server already filtered by category, skip client-side category check
      if (selectedCategory !== 'All' && !serverFiltered) {
        return (p.service || '').toLowerCase().includes(selectedCategory.toLowerCase());
      }

      return true;
    });
  }, [providers, query, selectedCategory, serverFiltered]);

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
          {!loading && !error && filtered.length === 0 && (
            <p style={{ padding: '1rem' }}>No providers match your search.</p>
          )}
          {filtered.map(provider => (
            <RepeatHouseDiv key={provider.id} provider={provider} />
          ))}
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
