import React from "react";
import Image, { StaticImageData } from "next/image";

type BannerCardsProps = {
  title1?: string;
  imageSrc?: string | StaticImageData;
};

const BannerCards: React.FC<BannerCardsProps> = ({ title1, imageSrc }) => {
  return (
    <div className="b-card">
      <div className="b-text">
        <h4>{title1 || "Untitled Banner"}</h4>
      </div>

      <div className="b-img">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title1 || "Banner image"}
            width={273}
            height={242}
            quality={100}
            priority
            className="object-cover rounded-md"
          />
        ) : (
          <Image
            src="/images/placeholder.jpg"
            alt="Placeholder"
            width={273}
            height={242}
            quality={80}
            className="object-cover rounded-md opacity-70"
          />
        )}
      </div>
    </div>
  );
};

export default BannerCards;
