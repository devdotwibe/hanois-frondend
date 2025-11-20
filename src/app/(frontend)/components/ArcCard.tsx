import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import profile from "../../../../public/images/profile.png"
import imghouse from "../../../../public/images/property-img.jpg"
import imgaction1 from "../../../../public/images/liked-heart.svg"
import { useState } from 'react'
const ArcCard = () => {

  const [showPopup, setShowPopup] = useState(false);



  return (



    <div className='arc-div-outer'>
      <div className="arc-div1">

        <div className="arc-profile-sec">
          <div className="arc-porofile">
          <Image
          src={profile}
          alt='img'
          width={50}
          height={50}
          />
        </div>

        <div className="arc-head-text">
          <h4>Sarah Mitchell</h4>
          <div className="cred">
            <div className="category-arch">
              <h6>Modern Residential</h6>

            </div>
            <div className="time-arch">
               <h6>2 hours ago</h6>

            </div>
          </div>

        </div>

        </div>


        <div className="arc-top-btn">
          <button>

          </button>
        </div>






      </div>

      <div className="arch-dis">
        <p>Just completed this stunning modern home in San Francisco! The client wanted clean lines with sustainable materials. What do you think of the floor-to-ceiling windows? 🏡✨</p>

      </div>

      <div className="arc-img">
        <Image
        src={imghouse}
        alt='img'
        width={500}
        height={600}

        />
      </div>
      <div className="action-listed">
        <div className="like-count-arch">
          <h5>124likes</h5>

        </div>
        <div className="comment-count-arch">
        <h5>2 comments</h5>


        </div>
      </div>

      <div className="arc-actions">


        <div className="arc-act1 like-arch">
          <Image src={imgaction1} alt='img' width={20} height={20}/>
        </div>

        <div className="arc-act1 comment-arc">
          <Image src={imgaction1} alt='img' width={20} height={20}/>
        </div>

        <div className="arc-act1 share-arc">
          <Image src={imgaction1} alt='img' width={20} height={20}/>
        </div>




      {/* ----- POPUP MODAL ----- */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Add a Comment</h3>

            <textarea
              placeholder="Write your comment..."
              className="comment-input"
            ></textarea>

            <div className="popup-buttons">
              <button onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="submit-btn">Submit</button>
            </div>
          </div>
        </div>
      )}




      </div>



    </div>
  )
}

export default ArcCard