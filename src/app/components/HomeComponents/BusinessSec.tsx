import React from 'react'
import Link from 'next/link'
import BusinessCard from '../ReusableComponents/Cards/BusinessCard';
import image1 from "../../../../public/images/lead.png"
import image2 from "../../../../public/images/grow.png"
import image3 from "../../../../public/images/support.png"

 const BusinesCardData = [
    {
      title1: 'Lead customers to your business',
      discption: 'Handis Support helps you provide personalized support when and where customers need it, so customers stay happy.',
      imageSrc: image1,
    },
    {
      title1: 'Grow without growing pains',
      discption: 'Handis is powerful enough to handle the most complex business, yet flexible enough to scale with you as you grow.',
      imageSrc: image2,
    },
    {
      title1: 'Support on every',
      spanText: 'Step',
      discption: 'Productive agents are happy agents. Give them all the support tools and information they need to best serve your customers.',
      imageSrc: image3,

    }
  ];

const BusinessSec = () => {
  return (
    <div className='business-wrap'>
      <div className="containers">

        <div className="businerr-row">
          <div className="business-div1">
          <h3>Here's how Handis
            <span>can help your</span>
            <span>business!</span>
          </h3>
          <p>Build more meaningful and lasting relationships — better understand their needs, identify new opportunities to help, address any problems faster.</p>
          <Link href="" className='get-listed'>Get Listed</Link>
        </div>

        <div className="business-div2">
          {BusinesCardData.map((item, index) => (
          <BusinessCard
            key={index}
            title1={item.title1}
            spanText={item.spanText}
            discption={item.discption}
            imageSrc={item.imageSrc}
          />
        ))}

        </div>
        </div>
      </div>


    </div>
  )
}

export default BusinessSec


// "use client";

// import React, { useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const BusinessSec = () => {
//   useEffect(() => {
//     let tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".cards",
//         pin: true,
//         pinSpacing: true,
//         markers: true,
//         start: "top top",
//         end: "+=1000",
//         scrub: 1,
//       },
//     });

//     tl.from(".card1", {
//       yPercent: 100,
//       opacity: 0,
//     });
//     tl.from(".card2", {
//       yPercent: 200,
//       opacity: 0,
//     });
//     tl.from(".card3", {
//       yPercent: 200,
//       opacity: 0,
//     });
//   }, []);

//   return (
//     <div className="business-section">
//       <div className="row">
//         <div className="col-12">
//           <div className="block_top">
//             <h1>Block Header</h1>
//           </div>
//         </div>
//       </div>

//       <div className="row cards-row">
//         <div className="col-12">
//           <div className="cards">
//             <div className="custom-card card1">
//               <h1>Slide 1</h1>
//             </div>
//             <div className="custom-card card2">
//               <h1>Slide 2</h1>
//             </div>
//             <div className="custom-card card3">
//               <h1>Slide 3</h1>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12">
//           <div className="next_block">
//             <h1>End content</h1>
//           </div>
//         </div>
//       </div>

//       <div className="spacer"></div>
//     </div>
//   );
// };

// export default BusinessSec;















