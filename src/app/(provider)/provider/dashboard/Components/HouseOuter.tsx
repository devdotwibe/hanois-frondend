import React, { useState } from 'react';
import HouseCard from './HouseCard';
import logo1 from "../../../../../../public/images/ahi-logo.jpg"; 

const HouseOuter = () => {
  const [image, setImage] = useState(null);
  const [professionalHeadline, setProfessionalHeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessionalHeadline(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Prepare form data to send
    const formData = new FormData();
    formData.append('image', image); // Append the image file
    formData.append('professional_headline', professionalHeadline); // Append the headline

    try {
      const response = await fetch('/api/providers/update-profile', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Profile updated successfully:', result);
      } else {
        console.error('Failed to update profile:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <HouseCard 
        logo={logo1}   
        name="American House Improvements Inc."
        description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
      />

      <div>
        <input
          type="text"
          value={professionalHeadline}
          onChange={handleHeadlineChange}
          placeholder="Enter your professional headline"
        />
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Uploading...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default HouseOuter;



// import React from 'react'
// import HouseCard from './HouseCard'
// import logo1 from "../../../../../../public/images/ahi-logo.jpg"; 

// const HouseOuter = () => {
//   return (
//     <div>

//         <HouseCard 
//         logo={logo1}   
//         name="American House Improvements Inc."
//         description="LA’s Highly Rated, Award-Winning Construction & Renovation Firm"
//       />

     
      
//     </div>
//   )
// }

// export default HouseOuter
