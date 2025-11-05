import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type BuildCardProps = {
  title1?: string;
  disc?: string;
  imageSrc?: string | StaticImageData;
  linkUrl?: string;
  linkText?: string;
};

const BuildCard: React.FC<BuildCardProps> = ({
  title1,
  imageSrc,
  disc,
  linkUrl = "#",
  linkText = "Learn More",
}) => {
  return (
    <div className="build-card">
      <div className="img-b">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={title1 || "img"}
            width={975}
            height={534}
          />
        )}
      </div>

      <div className="text-areab">
        <h4>{title1}</h4>
        <p>{disc}</p>

        <Link href={linkUrl} className="g-listed">
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default BuildCard;
