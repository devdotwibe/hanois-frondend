// "use client"; // if using Next.js App Router

// import React from "react";
// import Slider from "react-slick";
// import Image from "next/image";



// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import img1 from "../../../../public/images/property-img.jpg"


// const ImageSlider = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: { slidesToShow: 3 },
//       },
//       {
//         breakpoint: 768,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 480,
//         settings: { slidesToShow: 1 },
//       },
//     ],
//   };

//   const images = [
//     "../../../../public/images/property-img.jpg",
//     "../../../../public/images/property-img.jpg",
//     "../../../../public/images/property-img.jpg",
//     "../../../../public/images/property-img.jpg",
//     "../../../../public/images/property-img.jpg",
//     "../../../../public/images/property-img.jpg",
//   ];

//   return (
//     <div className="max-w-6xl mx-auto py-10 px-4">
//       <Slider {...settings}>
//         {images.map((src, index) => (
//           <div key={index} className="px-2">
//             <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
//               <Image
//                 src={src}
//                 alt={`Slide ${index + 1}`}
//                 width={400}
//                 height={300}
//                 className="w-full h-[250px] object-cover"
//               />
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default ImageSlider;
