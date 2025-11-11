import HouseCard1 from '@/app/(provider)/provider/dashboard/Components/HouseCard1'
import React from 'react'
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
  const startingBudget = provider?.starting_budget ?? null;

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
              <p>{startingBudget ? `$${startingBudget}` : '$10,000'}</p>
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


export default RepeatHouseDiv

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
