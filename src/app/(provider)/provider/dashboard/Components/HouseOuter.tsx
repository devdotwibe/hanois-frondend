// app/providers/[providerId]/page.tsx  (server component)
import React from "react";
import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";
import { API_URL } from "@/config"; // ensure API_URL is available server-side

type Props = {
  params: { providerId: string };
};

async function fetchProvider(providerId: string) {
  // server-side fetch; adjust endpoint to your API shape
  const res = await fetch(`${API_URL}providers/${providerId}`, {
    // optionally: { next: { revalidate: 0 } } if you want no caching
    // but remove if you want ISR or caching
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.provider ?? null;
}

export default async function ProviderPage({ params }: Props) {
  const providerId = Number(params.providerId || 5);
  const provider = await fetchProvider(String(providerId));

  const initialDescription = provider?.professional_headline ?? "";
  const initialImagePath = provider?.image ?? null;

  return (
    <div>
      <HouseCard
        logo={logo1}
        name={provider?.name ?? "Provider"}
        providerId={providerId}
        initialDescription={initialDescription}
        initialImagePath={initialImagePath}
      />
    </div>
  );
}
