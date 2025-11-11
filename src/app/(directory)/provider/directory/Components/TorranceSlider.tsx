"use client";

import React, { useEffect, useState } from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { API_URL, IMG_URL } from "@/config";
import { useRouter } from "next/navigation";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// -----------------------------
// 🟩 Card Component
// -----------------------------
type TorranceCardProps = {
  id: number;
  image: string;
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

  // 🟩 Navigate to detail page on click
  const handleClick = () => {
    router.push(`/service-provider-directory/service-provider-profile?id=${id}`);
  };

  return (
    <div className="torrance-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      {/* Image */}
      <div className="torrance-card-image-wrap">
        <Image
          src={image || "/images/property-img.jpg"}
          alt={title}
          width={400}
          height={260}
          className="rounded-md object-cover"
        />
        <span className="torrance-card-badge">{category}</span>
      </div>

      {/* Info */}
      <div className="torrance-card-info">
        <h3>{title}</h3>
        {description && <p className="desc">{description}</p>}
        <p>
          <strong>Style:</strong> {styleType || "—"}
        </p>
        <p>
          <strong>Space size:</strong> {spaceSize || "—"}
        </p>
        <p>
          <strong>Location:</strong> {location || "—"}
        </p>
      </div>
    </div>
  );
};

// -----------------------------
// 🟩 Custom Slider Arrows
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
// 🟩 Dynamic Slider Component
// -----------------------------
const TorranceSlider: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟩 Fetch projects dynamically
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      if (res.data && res.data.success) {
        setProjects(res.data.data.projects || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🟩 Slider Settings
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

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading projects...</p>;

  return (
    <div className="torrance-slider-wrapper">
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No projects available
        </p>
      ) : (
        <Slider {...settings}>
          {projects.map((proj) => {
            // ✅ Find the project’s cover image (or fallback)
            const coverImgObj =
              proj.images?.find((img: any) => img.is_cover) || proj.images?.[0];
            const imageUrl = coverImgObj
              ? `${IMG_URL}${coverImgObj.image_path}`
              : "/images/property-img.jpg";

            return (
              <div key={proj.id} className="torrance-slide">
                <TorranceCard
                  id={proj.id}
                  image={imageUrl}
                  category={proj.project_type_name || "Unknown"}
                  title={proj.title}
                  description={proj.notes}
                  styleType={proj.design_name || "—"}
                  spaceSize={proj.land_size || "—"}
                  location={proj.location || "—"}
                />
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default TorranceSlider;
