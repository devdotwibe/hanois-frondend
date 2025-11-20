// "use client";
// import React, { useState } from "react";

// import Image from 'next/image'
// import Link from 'next/link'
// import profile from "../../../../public/images/profile.png"
// import imghouse from "../../../../public/images/property-img.jpg"
// import imgaction1 from "../../../../public/images/liked-heart.svg"
// const ArcCard = () => {

//   const [showPopup, setShowPopup] = useState(false);
//   const [openComment, setOpenComment] = useState(false);




//   return (



//     <div className='arc-div-outer'>
//       <div className="arc-div1">

//         <div className="arc-profile-sec">
//           <div className="arc-porofile">
//           <Image
//           src={profile}
//           alt='img'
//           width={50}
//           height={50}
//           />
//         </div>

//         <div className="arc-head-text">
//           <h4>Sarah Mitchell</h4>
//           <div className="cred">
//             <div className="category-arch">
//               <h6>Modern Residential</h6>

//             </div>
//             <div className="time-arch">
//                <h6>2 hours ago</h6>

//             </div>
//           </div>

//         </div>

//         </div>


//         <div className="arc-top-btn">
//           <button>

//           </button>
//         </div>






//       </div>

//       <div className="arch-dis">
//         <p>Just completed this stunning modern home in San Francisco! The client wanted clean lines with sustainable materials. What do you think of the floor-to-ceiling windows? 🏡✨</p>

//       </div>

//       <div className="arc-img">
//         <Image
//         src={imghouse}
//         alt='img'
//         width={500}
//         height={600}

//         />
//       </div>
//       <div className="action-listed">
//         <div className="like-count-arch">
//           <h5>124likes</h5>

//         </div>
//         <div className="comment-count-arch">
//         <h5>2 comments</h5>


//         </div>
//       </div>

//       <div className="arc-actions">


//         <div className="arc-act1 like-arch">
//           <Image src={imgaction1} alt='img' width={20} height={20}/>
//         </div>

//         <div className="arc-act1 comment-arc">
//           <button onClick={() => setOpenComment(!openComment)}>
//             <Image src={imgaction1} alt='img' width={20} height={20}/>
//           </button>
//         </div>

//         <div className="arc-act1 share-arc" >
//           <button onClick={() => setShowPopup(true)}>
//             <Image src={imgaction1} alt='img' width={20} height={20}/>


//           </button>
//         </div>

//         {openComment && (
//         <div className="commented-sec">
//           <textarea
//             placeholder="Write a comment..."
//             className="comment-input"
//           ></textarea>

//           <button className="submit-btn">Post Comment</button>
//         </div>
//       )}





//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3>Add a Comment</h3>

//             <textarea
//               placeholder="Write your comment..."
//               className="comment-input"
//             ></textarea>

//             <div className="popup-buttons">
//               <button onClick={() => setShowPopup(false)}>Cancel</button>
//               <button className="submit-btn">Submit</button>
//             </div>
//           </div>
//         </div>
//       )}




//       </div>



//     </div>
//   )
// }

// export default ArcCard










"use client";
import React, { useState } from "react";

import Image from "next/image";
import profile from "../../../../public/images/profile.png";
import imgaction1 from "../../../../public/images/arch-heart.svg";
import imgaction2 from "../../../../public/images/arc-comment.svg";
import imgaction3 from "../../../../public/images/arch-share.svg";
import moreoption from "../../../../public/images/more-options-icon.svg";
import imgs1 from "../../../../public/images/facebook.svg"
import imgs4 from "../../../../public/images/instagram.svg"
import imgs3 from "../../../../public/images/twitter.svg"
import imgs2 from "../../../../public/images/linkedin.svg"

import arrowsend from "../../../../public/images/arrowsend.svg"
import carbonlink from "../../../../public/images/carbon-link.svg"

interface ArcCardProps {
  name: string;
  category: string;
  time: string;
  description: string;
  image: any;
  likes: number;
  commentsCount: number;


}

const ArcCard: React.FC<ArcCardProps> = ({
  name,
  category,
  time,
  description,
  image,
  likes,
  commentsCount,

}) => {


    const [showPopup, setShowPopup] = useState(false);
  const [openComment, setOpenComment] = useState(false);


  return (
    <div className="arc-div-outer">

      <div className="arc-div1">
        <div className="arc-profile-sec">
          <div className="arc-porofile">
            <Image src={profile} alt="img" width={50} height={50} />
          </div>

          <div className="arc-head-text">
            <h4>{name}</h4>
            <div className="cred">
              <div className="category-arch">
                <h6>{category}</h6>
              </div>
              <div className="time-arch">
                <h6>{time}</h6>
              </div>
            </div>
          </div>
        </div>

        <div className="arc-top-btn">
          <button>
            <Image
            src={moreoption}
            alt="img"
            width={20}
            height={20}
            />
          </button>
        </div>
      </div>

      <div className="arch-dis">
        <p>{description}</p>
      </div>

      <div className="arc-img">
        <Image src={image} alt="img" width={800} height={527} />
      </div>

      <div className="action-listed">
        <h5>{likes} likes</h5>
        <h5>{commentsCount} comments</h5>
      </div>

      <div className="arc-actions">

        <div className="arc-act1 like-arch">
          <button>
           <Image src={imgaction1} alt="img" width={20} height={20} />


          </button>
                     <span>Like</span>

        </div>

        <div className="arc-act1 comment-arc">
          <button onClick={() => setOpenComment(!openComment)}>
            <Image src={imgaction2} alt="img" width={20} height={20} />

          </button>
           <span>Comment</span>
        </div>

        <div className="arc-act1 share-arc">
          <button onClick={() => setShowPopup(true)}>
            <Image src={imgaction3} alt="img" width={20} height={20} />
          </button>
                     <span>Share</span>

        </div>




          {openComment && (
        <div className="commented-sec">


      <div className="arc-div1 e-arc11">
        <div className="arc-profile-sec">
          <div className="arc-porofile">
            <Image src={profile} alt="img" width={40} height={40} />
          </div>

          <div className="arc-head-text">
            <h4>Sarah Mitchell</h4>
            <p>The sustainability aspect is impressive. What materials did you use?</p>

          </div>


          <span className="time-now">1hour ago</span>
        </div>



      </div>





          <div className="post-comment">
            <textarea
            placeholder="Write a comment..."
            className="comment-input"
          ></textarea>

          <button className="send-arrow">
                            <Image src={arrowsend} alt="img" height={20} width={20}/>


          </button>

          </div>

        </div>
      )}


           {showPopup && (
        <div className="popup-overlay1"
        onClick={() => setShowPopup(false)}>
          <div className="popup-box"
          onClick={(e) => e.stopPropagation()}>
            <h3>Share</h3>

            <div className="share-icons">

              <div className="share-icon1">
                <Image src={carbonlink} alt="img" height={20} width={20}/>
              </div>
              <div className="share-icon1">
                <Image src={imgs1} alt="img" height={20} width={20}/>
              </div>

              <div className="share-icon1">
                <Image src={imgs2} alt="img" height={20} width={20}/>
              </div>
              <div className="share-icon1">
                <Image src={imgs3} alt="img" height={20} width={20}/>
              </div>
              <div className="share-icon1">
                <Image src={imgs4} alt="img" height={20} width={20}/>
              </div>

            </div>

            <div className="popup-buttons">
              {/* <button onClick={() => setShowPopup(false)}>Cancel</button> */}
            </div>


          </div>
        </div>
      )}

      </div>

    </div>
  );
};

export default ArcCard;
