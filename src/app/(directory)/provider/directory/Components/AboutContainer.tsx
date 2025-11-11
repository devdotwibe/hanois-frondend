import React from 'react'

const AboutContainer = ({ provider }) => {
  const about = provider?.notes || provider?.description || "";
  return (
    <div className='about-content'>
      <div className="">
        <h3>About</h3>
        <p>{about || "No about information provided."}</p>

        {provider?.extra_about && <p>{provider.extra_about}</p>}

        <button className='show-more'>Show More</button>
      </div>
    </div>
  )
}

export default AboutContainer



// import React from 'react'

// const AboutContainer = () => {
//   return (
//     <div className='about-content'> 

//         <div className="">

//         <h3>About</h3>
//         <p>American Home Improvement, Inc. - it is our mission to provide the highest quality of service in all aspects of our business. We are extremely thorough in the services that we provide and aim to be very receptive to any client’s issues, questions or concerns and handle them promptly and professionally.</p>


//         <p>We take the necessary steps to ensure that our clients are completely satisfied with all of our contractual and assumed responsibilities. Above all else, we will fulfill these responsibilities while maintaining the highest ethical standards in both our work and our character.</p>

//         <button className='show-more'>Show More</button>

//         </div>
        
      
//     </div>
//   )
// }

// export default AboutContainer
