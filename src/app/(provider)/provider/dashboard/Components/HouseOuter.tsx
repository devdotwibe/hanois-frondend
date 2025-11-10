"use client";
import React, { useState } from "react";
import HouseCard from "./HouseCard";

const HouseOuter: React.FC = () => {
  const [providerData] = useState<any>(() => {
    // 1. Check if provider data already exists in localStorage
    const cachedProvider = localStorage.getItem("provider");
    if (cachedProvider) {
      try {
        return JSON.parse(cachedProvider);
      } catch {}
    }

    // 2. Fallback to user object
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const provider = {
        id: parsed.id || parsed.provider_id || parsed.user_id,
        name: parsed.name || "",
        professional_headline: parsed.professional_headline || "",
        image: parsed.image || null,
      };
      // Cache it for future renders
      localStorage.setItem("provider", JSON.stringify(provider));
      return provider;
    }

    // 3. Fallback to token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64 = token.split(".")[1];
        const payload = JSON.parse(atob(base64));
        const provider = {
          id: payload.provider_id || payload.id || payload.user_id,
          name: payload.name || "",
          professional_headline: payload.professional_headline || "",
          image: payload.image || null,
        };
        // Cache it for future renders
        localStorage.setItem("provider", JSON.stringify(provider));
        return provider;
      } catch {}
    }

    // 4. If nothing is available
    return null;
  });

  if (!providerData) return null;

  return (
    <div>
      <HouseCard
        providerId={providerData.id}
        name={providerData.name || ""}
        initialDescription={providerData.professional_headline || ""}
        initialImagePath={providerData.image || null}
      />
    </div>
  );
};

export default HouseOuter;


// "use client";
// import React, { useEffect, useState } from "react";
// import HouseCard from "./HouseCard";
// import { API_URL } from "@/config";

// const HouseOuter: React.FC = () => {
//   const [providerData, setProviderData] = useState<any>(null);

//   useEffect(() => {
//     const fetchProvider = async () => {
//       let providerId: number | null = null;

//       // determine providerId from localStorage / token
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id) || null;
//       } else {
//         const token = localStorage.getItem("token");
//         if (token) {
//           try {
//             const base64 = token.split(".")[1];
//             const payload = JSON.parse(atob(base64));
//             providerId = Number(payload?.provider_id || payload?.id || payload?.user_id) || null;
//           } catch {}
//         }
//       }

//       if (!providerId) return;

//       try {
//         const res = await fetch(`${API_URL.replace(/\/+$/, "")}/providers/${providerId}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//           },
//         });
//         const data = await res.json();

//         let provider: any = data?.data?.provider || data?.provider || data?.data || data;
//         setProviderData(provider);
//       } catch (err) {
//         console.error("Failed to fetch provider", err);
//       }
//     };

//     fetchProvider();
//   }, []);

//   if (!providerData) return null;

//   return (
//     <div>
//       <HouseCard
//         providerId={providerData.id}
//         name={providerData.name || ""}
//         initialDescription={providerData.professional_headline || ""}
//         initialImagePath={providerData.image || null}
//       />
//     </div>
//   );
// };

// export default HouseOuter;




// "use client";
// import React from "react";
// import HouseCard from "./HouseCard";
// import { API_URL } from "@/config";

// const HouseOuter: React.FC = () => {
//   let providerId: number | null = null;
//   let providerData: any = null;

//   const userData = localStorage.getItem("user");
//   if (userData) {
//     const parsed = JSON.parse(userData);
//     providerId = Number(parsed?.id || parsed?.provider_id || parsed?.user_id);
//   } else {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const base64 = token.split(".")[1];
//       const payload = JSON.parse(atob(base64));
//       providerId = Number(payload?.provider_id || payload?.id || payload?.user_id);
//     }
//   }

//   if (providerId) {
//     const cached = localStorage.getItem(`provider_${providerId}`);
//     if (cached) providerData = JSON.parse(cached);
//   }

//   if (!providerId || !providerData) return null;

//   return (
//     <div>
//       <HouseCard
//         providerId={providerId}
//         name={providerData.name || ""}
//         initialDescription={providerData.professional_headline || ""}
//         initialImagePath={providerData.image || null}
//       />
//     </div>
//   );
// };

// export default HouseOuter;
