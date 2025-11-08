"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import BannerCardWrapper from "./BannerCardWrapper";
import { API_URL } from "@/config";

interface BannerItem {
  id: number;
  subtitle: string; // HTML string
  subheading: string;
  buttonname: string;
  language: string;
}

interface BannerApiResponse {
  success: boolean;
  message: string;
  data: {
    banners: BannerItem[];
    count: number;
  };
}

const ReadySec = ({ lang }: { lang: string }) => {
  const [loading, setLoading] = useState(false);
  const [subtitle, setSubtitle] = useState<string>("");
  const [subheading, setSubheading] = useState<string>("");
  const [buttonname, setButtonname] = useState<string>("");

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<BannerApiResponse>(`${API_URL}banner`);
        const banners = res.data.data?.banners || [];

        const normalize = (l: string) => (l || "").trim().toLowerCase();
        const selectedBanner = banners.find(
          (b) => normalize(b.language) === lang
        );

        if (selectedBanner) {
          setSubtitle(selectedBanner.subtitle || "");
          setSubheading(selectedBanner.subheading || "");
          setButtonname(selectedBanner.buttonname || "");
        }
      } catch (err) {
        console.error("Error fetching ready section data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, [lang]);

  return (
    <div className={`readt-sec ${lang === "ar" ? "rtl" : ""}`}>
      {/* Blue Section with Cards */}
      <div className="bg-blue1">
        <div className="containers">
          <div className="cards-wrapp">
            <BannerCardWrapper lang={lang} />
          </div>
        </div>
      </div>

      {/* Dark Blue Ready Section */}
      <div className="bg-dark-blue">
        <div className="containers">
          <div className="ready-div">
            {loading ? (
              <p></p>
            ) : (
              <>
              
                {subtitle && (
                  <div
                    className="ready-title"
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
                )}

              

                  <Link href="" className='signup-btn'>Sign Up Now</Link>
                  <h6>Full access. No credit card required.</h6>



              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadySec;
