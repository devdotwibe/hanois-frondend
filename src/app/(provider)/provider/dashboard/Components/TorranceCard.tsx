"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

type TorranceCardProps = {
  id: number;
  image: string | StaticImageData;
  category: string;
  title: string;
  description?: string;
  styleType?: string;
  spaceSize?: string;
  location?: string;
};

const TorranceCard: React.FC<TorranceCardProps> = ({
  id,
  image,
  category,
  title,
  description,
  styleType,
  spaceSize,
  location,
}) => {
  const router = useRouter();

  // 🟩 Handle image click
  const handleClick = () => {
    router.push(`/service-provider-directory/service-provider-profile?id=${id}`);
  };

  return (
    <div className="torrance-card">
      {/* Image section */}
      <div
        className="torrance-card-image-wrap"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
      >
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="torrance-card-image"
        />
        <span className="torrance-card-badge">{category}</span>
      </div>

      {/* Info section */}
      <div className="torrance-card-info">
        <h3 className="torrance-card-title">{title}</h3>
        <p className="torrance-card-desc">{description}</p>

        <p>
          <strong>Style:</strong> {styleType}
        </p>
        <p>
          <strong>Space size:</strong> {spaceSize}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
      </div>
    </div>
  );
};

export default TorranceCard;
