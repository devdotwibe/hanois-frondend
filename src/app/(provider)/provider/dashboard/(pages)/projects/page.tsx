import React from "react";
import { API_URL, IMG_URL, SITE_URL } from "@/config";
import DetailCard from "@/app/(directory)/provider/Components/DetailCard";
import TabBtns from "../../Components/TabBtns";
import TorranceCard from "../../Components/TorranceCard";
import UploadBox from "../../Components/UploadBox";

// This function fetches data at the time of page load, on the server side
export async function getServerSideProps(context) {
  const { providerId } = context.query;

  // Handle case if providerId is not provided
  if (!providerId) {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch provider data
    const providerRes = await fetch(`${API_URL}providers/${encodeURIComponent(providerId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!providerRes.ok) {
      const body = await providerRes.json();
      throw new Error(body?.error || `Failed to fetch provider (${providerRes.status})`);
    }

    const providerData = await providerRes.json();
    const provider = providerData?.provider ?? null;

    if (!provider) {
      throw new Error("No provider data found.");
    }

    // Fetch provider's projects data
    const projectsRes = await fetch(`${API_URL}/projects?provider_id=${providerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!projectsRes.ok) {
      const body = await projectsRes.json();
      throw new Error(body?.error || `Failed to fetch projects (${projectsRes.status})`);
    }

    const projectsData = await projectsRes.json();
    const projects = projectsData?.data?.projects ?? [];

    return {
      props: {
        provider,
        projects,
      },
    };
  } catch (error) {
    return {
      notFound: true,  // Return 404 if there's an error fetching data
    };
  }
}

const ProjectComponent = ({ provider, projects }) => {
  return (
    <div className="project-component">
      {/* 🟩 Dynamic DetailCard */}
      <DetailCard
        logo={provider?.image || "/path/to/logo.png"} // Use provider's logo or a placeholder
        name={provider?.name || "Unknown Provider"} // Use provider's name
        description={provider?.notes || provider?.service_notes || provider?.professional_headline || "No description available"} // Description from provider
      />

      <TabBtns />

      {/* 🟩 Add Project Button */}
      <button className="add-proj" onClick={() => {}}>
        <span className="icon">+</span> Add Project
      </button>

      {/* 🟩 Projects Section */}
      <div className="all-proj">
        {projects.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No projects found. Please add one.
          </p>
        ) : (
          <div className="torrance-div">
            {projects.map((proj) => {
              const coverImgObj =
                proj.images?.find((img) => img.is_cover) || proj.images?.[0];
              const imageUrl = coverImgObj
                ? `${IMG_URL}${coverImgObj.image_path}`
                : "/images/property-img.jpg";

              return (
                <TorranceCard
                  key={proj.id}
                  id={proj.id}
                  image={imageUrl}
                  category={proj.project_type_name || "Unknown"}
                  title={proj.title}
                  description={proj.notes}
                  styleType={proj.design_name || "—"}
                  spaceSize={proj.land_size || "—"}
                  location={proj.location || "—"}
                />
              );
            })}
          </div>
        )}

        {/* 🟩 Add Project Form */}
        <div className="add-projects">
          <UploadBox />
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
