import type { ReactNode } from "react";
import { notFound } from "next/navigation";


const supportedLangs = ["en", "ar"] as const;
type Lang = (typeof supportedLangs)[number];

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug?: string[] };
}) {

    const langFromSlug = params.slug?.[0];

    const lang: Lang = supportedLangs.includes(langFromSlug as Lang)
      ? (langFromSlug as Lang)
      : "en"; 

    if (langFromSlug && !supportedLangs.includes(langFromSlug as Lang)) {
      notFound();
    }

  return (
    
        <>

            {children}

        </>
    ); 
}
