"use client";

import HouseCard from "./HouseCard";
import logo1 from "../../../../../../public/images/ahi-logo.jpg";

/**
 * Decode a JWT payload (no verification) — returns null on failure.
 */
function decodeJwtPayload(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // atob is available in the browser
    const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

const HouseOuter = () => {
  // Only runs in the browser because this is a client component ("use client")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // If you keep provider info separately in localStorage, try that fallback:
  const providerFromStorage = typeof window !== "undefined" ? localStorage.getItem("provider") : null;

  let providerId: number | null = null;

  // Try token payload
  const payload = decodeJwtPayload(token);
  if (payload) {
    // adjust keys based on your token payload shape
    providerId =
      (payload.providerId ?? payload.id ?? payload.userId ?? payload.sub) || null;
  }

  // fallback to a stored provider object
  if (!providerId && providerFromStorage) {
    try {
      const p = JSON.parse(providerFromStorage);
      providerId = p?.id ?? p?.providerId ?? null;
    } catch {
      /* ignore */
    }
  }

  if (!providerId) {
    return (
      <div>
        {/* Minimal fallback UI — user should be logged in */}
        <p>Please sign in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <HouseCard
        logo={logo1}
        name="American House Improvements Inc."
        providerId={Number(providerId)}
      />
    </div>
  );
};

export default HouseOuter;
