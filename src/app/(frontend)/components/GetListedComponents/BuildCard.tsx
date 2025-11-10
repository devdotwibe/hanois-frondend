import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type BuildCardProps = {
  title1?: string; // HTML string (from backend)
  imageSrc?: string | StaticImageData;
  linkUrl?: string;
};

const BuildCard: React.FC<BuildCardProps> = ({
  title1 = "",
  imageSrc,
  linkUrl = "#",
}) => {
  return (
    <div className="build-card">
      {/* 🖼️ Image Section */}
      <div className="img-b">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="Handis Image"
            width={975}
            height={534}
            unoptimized // avoid Next.js optimization errors for remote URLs
          />
        )}
      </div>

      {/* 🧠 Text Area */}
      <div className="text-areab">
        {/* Render backend HTML safely */}
        <div
          className="card-content"
          dangerouslySetInnerHTML={{ __html: title1 }}
        />

        {/* CTA Button — Static Text */}
        <Link href={linkUrl} className="g-listed">
          Get Listed
        </Link>
      </div>
    </div>
  );
};

export default BuildCard;
