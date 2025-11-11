import React, { useState, useEffect } from 'react';
import HouseCard1 from '@/app/(provider)/provider/dashboard/Components/HouseCard1';
import ImageSlider from './ImageSlider';

// base for images in your API
import { IMG_URL } from "@/config";

const RepeatHouseDiv = ({ provider }) => {
  const [serviceCosts, setServiceCosts] = useState([]);
  const [loadingCosts, setLoadingCosts] = useState(true);
  const [error, setError] = useState(null);

  // Debugging the provider data
  console.log("Provider data:", provider);

  const logoSrc = provider?.image ? `${IMG_URL}${provider.image}` : '/images/ahi-logo.jpg';
  const name = provider?.name || 'Unknown Provider';
  const description = provider?.professional_headline || provider?.service || '';
  const services = provider?.service || 'Not specified';
  const location = provider?.location || 'Not specified';

  // Fetch service costs
  useEffect(() => {
    const fetchServiceCosts = async () => {
      setLoadingCosts(true);
      setError(null);
      try {
        const response = await fetch('https://hanois.dotwibe.com/api/api/providers/all-provider-services');
        const data = await response.json();

        if (data.success) {
          const providerServices = data.data.filter(service => service.provider_name === provider.name);

          // Get the lowest cost for the provider's services
          const minCost = providerServices
            .map(service => parseFloat(service.average_cost))
            .filter(cost => !isNaN(cost)) // Ensure cost is a valid number
            .reduce((min, cost) => (cost < min ? cost : min), Infinity);

          // Set the service costs and update loading state
          setServiceCosts(minCost === Infinity ? null : minCost);
        } else {
          setError('Failed to fetch service costs');
        }
      } catch (err) {
        setError('Error fetching service costs');
      } finally {
        setLoadingCosts(false);
      }
    };

    fetchServiceCosts();
  }, [provider]);

  const startingBudget = serviceCosts ? `$${serviceCosts}` : '$10,000';

  return (
    <div className="repeat-house-div">
      <div className="house-div">
        <HouseCard1
          logo={logoSrc}
          name={name}
          description={description}
        />
        <button className="detail-btn">Details</button>
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
              <p>{startingBudget}</p>
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
