import React from 'react'
import ArcCard from './ArcCard'
import imghouse from "../../../../public/images/property-img.jpg"

const data = [
  {
    name: "Sarah Mitchell",
    category: "Modern Residential",
    time: "2 hours ago",
    description: "Just completed this stunning modern home!",
    image: imghouse,
    likes: 124,
    commentsCount: 2,
  },
  {
    name: "John Carter",
    category: "Interior Design",
    time: "5 hours ago",
    description: "Warm tones with minimalistic styling.",
    image: imghouse,
    likes: 98,
    commentsCount: 4,
  }
];

const ArchetectCommunity = () => {
  return (
    <div className='arc-community-sec'>
      <div className="containers">
        <div className="arc-cover">
          <div className="arch-intro">
             <h3>Architect Community</h3>
          <p>Explore the latest projects, insights, and inspiration from our talented architects</p>

          </div>



          <div className='saperte-arch'>
            {data.map((item, index) => (
              <div key={index}>
                <ArcCard {...item} />


              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ArchetectCommunity
