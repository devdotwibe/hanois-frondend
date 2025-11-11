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

const TorranceCard = ({
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

  return (
    <div
      className="torrance-card"
      onClick={() => router.push(`/provider/directory/profile-detail?id=${id}`)}
      style={{ cursor: "pointer" }}
    >
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

      <div className="torrance-card-info">
        <h3>{title}</h3>
        {description && <p className="desc">{description}</p>}
        <p><strong>Style:</strong> {styleType || "—"}</p>
        <p><strong>Space size:</strong> {spaceSize || "—"}</p>
        <p><strong>Location:</strong> {location || "—"}</p>
      </div>
    </div>
  );
};

const NextArrow = ({ onClick }) => (
  <button className="arrow-btn next" onClick={onClick}>
    <ChevronRight size={22} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="arrow-btn prev" onClick={onClick}>
    <ChevronLeft size={22} />
  </button>
);

const TorranceSlider = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);

  // 🟩 Get logged-in user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setProviderId(user.id);
  }, []);

  // 🟩 Fetch only this provider’s projects
  const fetchProjects = async () => {
    if (!providerId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/projects?provider_id=${providerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success) {
        setProjects(res.data.data.projects || []);
      } else {
        console.warn("⚠️ Unexpected response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching provider projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [providerId]);

  const settings = {
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading projects...</p>;

  return (
    <div className="torrance-slider-wrapper">
      <h2>My Projects</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: "center" }}>No projects found.</p>
      ) : (
        <Slider {...settings}>
          {projects.map((proj) => {
            const coverImgObj =
              proj.images?.find((img) => img.is_cover) || proj.images?.[0];
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
