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
