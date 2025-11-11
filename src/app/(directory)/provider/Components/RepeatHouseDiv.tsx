import HouseCard1 from '@/app/(provider)/provider/dashboard/Components/HouseCard1'
import React, { useEffect, useState } from 'react'
import ImageSlider from './ImageSlider'
// base for images in your API
import { IMG_URL } from "@/config";

const RepeatHouseDiv = ({ provider }) => {
  // Debugging the provider data
  console.log("Provider data:", provider);

  const logoSrc = provider?.image ? `${IMG_URL}${provider.image}` : '/images/ahi-logo.jpg';
  const name = provider?.name || 'Unknown Provider';
  const description = provider?.professional_headline || provider?.service || '';
  const services = provider?.service || 'Not specified';
  const location = provider?.location || 'Not specified';

  // startingBudget state: { amount: number|null, currency: string|null }
  const [startingBudget, setStartingBudget] = useState({ amount: null, currency: null });
  const [costLoading, setCostLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCosts = async () => {
      if (!provider || !provider.id) return;
      setCostLoading(true);
      try {
        const res = await fetch('https://hanois.dotwibe.com/api/api/providers/all-provider-services');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = json?.data ?? json?.data?.data ?? json; // be defensive

        if (!Array.isArray(items)) {
          if (mounted) setStartingBudget({ amount: null, currency: null });
          return;
        }

        // Filter service entries for this provider
        const providerServices = items.filter(
          (s) => Number(s.provider_id) === Number(provider.id)
        );

        // Extract numeric average_costs (ignore null/non-numeric)
        const parsed = providerServices
          .map(s => {
            const amt = s.average_cost == null ? null : Number(String(s.average_cost).replace(/,/g, ''));
            return { amt: Number.isFinite(amt) ? amt : null, currency: s.currency || null };
          })
          .filter(x => x.amt !== null);

        if (parsed.length === 0) {
          if (mounted) setStartingBudget({ amount: null, currency: null });
          return;
        }

        // find minimum amount and its currency (first occurrence)
        let min = parsed[0];
        for (let i = 1; i < parsed.length; i++) {
          if (parsed[i].amt < min.amt) min = parsed[i];
        }

        if (mounted) setStartingBudget({ amount: min.amt, currency: min.currency || null });
      } catch (err) {
        console.error('Failed to fetch provider service costs', err);
        if (mounted) setStartingBudget({ amount: null, currency: null });
      } finally {
        if (mounted) setCostLoading(false);
      }
    };

    fetchCosts();

    return () => {
      mounted = false;
    };
  }, [provider]);

  // Format display for budget
  const renderStartingBudget = () => {
    if (costLoading) return 'Loading…';
    if (startingBudget.amount != null) {
      // show currency then amount (currency may be like 'KD' or 'EUR')
      return startingBudget.currency
        ? `${startingBudget.currency} ${Number(startingBudget.amount).toLocaleString()}`
        : `$${Number(startingBudget.amount).toLocaleString()}`;
    }
    // fallback default (kept same as before)
    return '$10,000';
  };

  return (
    <div className="repeat-house-div">
      <div className="house-div">
        <HouseCard1
          logo={logoSrc}
          name={name}
          description={description}
        />
        <button className='detail-btn'>Details</button>
      </div>

      <div className="details">
        <div className="det1">
          <div className="d-row">
            <div className="d-col">
              <p><strong>Services</strong></p>
            </div>
            <div className="d-col">
              <p>{services}</p>
            </div>
          </div>

          <div className="d-row">
            <div className="d-col">
              <p><strong>Luxury type</strong></p>
            </div>
            <div className="d-col">
              <p>Modern, Futurism, Classic</p> {/* Static placeholder */}
            </div>
          </div>
        </div>

        <div className="det1 det2">
          <div className="d-row">
            <div className="d-col">
              <p><strong>Starting Budget</strong></p>
            </div>
            <div className="d-col">
              <p>{renderStartingBudget()}</p>
            </div>
          </div>

          <div className="d-row">
            <div className="d-col">
              <p><strong>Location</strong></p>
            </div>
            <div className="d-col">
              <p>{location}</p>
            </div>
          </div>
        </div>
      </div>

      <ImageSlider />
    </div>
  );
};

export default RepeatHouseDiv;


// import HouseCard from '@/app/(provider)/provider/dashboard/Components/HouseCard'
// import React from 'react'

// import logo1 from "../../../../../public/images/ahi-logo.jpg"
// import ImageSlider from './ImageSlider';


// const RepeatHouseDiv = () => {
//   return (


        
//         <div className="repeat-house-div">

//           <div className="house-div">

//         <HouseCard 
//         logo={logo1}   
//         name="American House Improvements Inc."
//         description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
//       />


   

//       <button className='detail-btn'>Details</button>

//         </div>



//         <div className="details">


//           <div className="det1">
//             <div className="d-row">
//               <div className="d-col">
//                 <p><strong>Services</strong></p>
                
//               </div>
//               <div className="d-col">
//                 <p>Architectural Services / Construction</p>

//               </div>
//             </div>
//             <div className="d-row">
//               <div className="d-col">
//                 <p><strong>Luxury type</strong></p>
                
//               </div>
//               <div className="d-col">
//                 <p>Modern, Futurism, Classic</p>

//               </div>
//             </div>

//           </div>



//           <div className="det1 det2">
//              <div className="d-row">
//               <div className="d-col">
//                 <p><strong> Starting Budget</strong></p>
                
//               </div>
//               <div className="d-col">
//                 <p>$10,000</p>

//               </div>
//             </div>
//              <div className="d-row">
//               <div className="d-col">
//                 <p><strong> Location</strong></p>
                
//               </div>
//               <div className="d-col">
//                 <p>Kuwait</p>

//               </div>
//             </div>

//           </div>

//         </div>

//         <ImageSlider />

       

//         </div>
      
 
//   )
// }

// export default RepeatHouseDiv
