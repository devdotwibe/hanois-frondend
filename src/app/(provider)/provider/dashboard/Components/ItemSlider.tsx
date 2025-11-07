

"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// const ItemSlider: React.FC = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
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

  const images: string[] = [
    "/images/property-img.jpg",
    "/images/property-img.jpg",
    "/images/property-img.jpg",
    "/images/property-img.jpg",
    "/images/property-img.jpg",
    "/images/property-img.jpg",
  ];

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
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ItemSlider;
