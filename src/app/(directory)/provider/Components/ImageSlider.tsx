"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { IMG_URL } from "@/config"; // Import IMG_URL from config

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Arrow buttons for the slider
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-10 transition"
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md z-10 transition"
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </button>
  );
};

// ImageSlider component that receives project data
const ImageSlider: React.FC<{ projects: any[] }> = ({ projects }) => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Flatten the image paths from the projects and prepend the IMG_URL
  const images = projects
    .map(project => project.images)
    .flat()
    .map(image => IMG_URL + image.image_path); // Concatenate IMG_URL with the image path

  return (
    <div className="relative max-w-6xl mx-auto py-10 px-4">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="px-2">
            <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-[180px] object-cover"
                loading="lazy" // Optional: Lazy load images for better performance
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
