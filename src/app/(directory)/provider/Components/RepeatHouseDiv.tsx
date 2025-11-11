"use client";

import React, { useState, useEffect } from 'react';
import HouseCard1 from '@/app/(provider)/provider/dashboard/Components/HouseCard1';
import ImageSlider from './ImageSlider';

// base for images in your API
import { IMG_URL } from "@/config";

const RepeatHouseDiv = ({ provider }) => {
  const [serviceCosts, setServiceCosts] = useState(null);
  const [loadingCosts, setLoadingCosts] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

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

          // Get the lowest cost and associated currency for the provider's services
          const minCostData = providerServices
            .map(service => ({
              cost: parseFloat(service.average_cost),
              currency: service.currency
            }))
            .filter(({ cost }) => !isNaN(cost)) // Ensure cost is a valid number
            .reduce((min, service) => (service.cost < min.cost ? service : min), { cost: Infinity, currency: 'USD' });

          // Set the service costs and update loading state
          setServiceCosts(minCostData.cost === Infinity ? null : minCostData);
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

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await fetch('https://hanois.dotwibe.com/api/api/projects');
        const data = await response.json();

        if (data.success) {
          // Filter projects that belong to the current provider
          const providerProjects = data.data.projects.filter(project => project.provider_id === provider.id);
          setProjects(providerProjects);
        }
      } catch (err) {
        setError('Error fetching project data');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [provider]);

  // Format the starting budget and currency safely
  const startingBudget = serviceCosts?.cost
    ? `${serviceCosts.currency} ${serviceCosts.cost.toFixed(2)}`
    : '$0'; // Fallback to default if no cost is found

  // Get the luxury type (design_name) from the projects
  const luxuryType = projects.length > 0 ? projects[0]?.design_name : 'Not specified';

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
              <p><strong>Luxury Type</strong></p>
            </div>
            <div className="d-col">
              <p>{luxuryType}</p>
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

      <ImageSlider projects={projects} />
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
