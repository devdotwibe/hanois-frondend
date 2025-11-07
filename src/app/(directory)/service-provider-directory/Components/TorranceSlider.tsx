"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// -----------------------------
// Card Component
// -----------------------------
type TorranceCardProps = {
  image: string | StaticImageData;
  category: string;
  title: string;
  description?: string;
  styleType?: string;
  spaceSize?: string;
  location?: string;
};

const TorranceCard: React.FC<TorranceCardProps> = ({
  image,
  category,
  title,
  description,
  styleType,
  spaceSize,
  location,
}) => {
  return (
    <div className="torrance-card">
      <div className="torrance-card-img">
        <Image src={image} alt={title} width={400} height={260} />
        <span className="category-badge">{category}</span>
      </div>

      <div className="torrance-card-info">
        <h3>{title}</h3>
        {description && <p className="desc">{description}</p>}
        <p><strong>Style:</strong> {styleType}</p>
        <p><strong>Space size:</strong> {spaceSize}</p>
        <p><strong>Location:</strong> {location}</p>
      </div>
    </div>
  );
};

// -----------------------------
// Arrows
// -----------------------------
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="arrow-btn next" onClick={onClick}>
      <ChevronRight size={22} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button className="arrow-btn prev" onClick={onClick}>
      <ChevronLeft size={22} />
    </button>
  );
};

// -----------------------------
// Slider
// -----------------------------
const TorranceSlider: React.FC = () => {
  const cards = [
    {
      image: "/images/property-img.jpg",
      category: "Commercial",
      title: "Complete home remodeling",
      description:
        "3/4 bath with beautiful gold accents to compliment all the white tile, and a master bathroom layout.",
      styleType: "Modern",
      spaceSize: "56 m²",
      location: "New York",
    },
    {
      image: "/images/property-img.jpg",
      category: "Housing",
      title: "Torrance 2 modern bathroom remodel",
      description:
        "Beautiful gold accents to compliment all the white tile, and a master terrace view.",
      styleType: "Modern",
      spaceSize: "56 m²",
      location: "New York",
    },
    {
      image: "/images/property-img.jpg",
      category: "Housing",
      title: "Torrance 3 luxury villa",
      description:
        "Spacious modern villa with garden view and rooftop terrace.",
      styleType: "Modern",
      spaceSize: "120 m²",
      location: "New York",
    },
    {
      image: "/images/property-img.jpg",
      category: "Housing",
      title: "Stylish apartment upgrade",
      description:
        "Redesigned with a minimal and bright theme to complement urban living.",
      styleType: "Minimal",
      spaceSize: "80 m²",
      location: "Los Angeles",
    },
  ];

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="torrance-slider-wrapper">
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="torrance-slide">
            <TorranceCard {...card} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TorranceSlider;
