'use client';

import React, { useState, useEffect } from 'react';
import DetailIntro from '@/app/(directory)/Components/DetailIntro';
import AboutContainer from '../../Components/AboutContainer';
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo';
import ServiceDiv from '../../Components/ServiceDiv';
import TorranceSlider from '../../Components/TorranceSlider';

const Page = ({ providerId }) => {
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider data when the component mounts
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await fetch(`https://hanois.dotwibe.com/api/api/providers/${providerId}`);
        const data = await response.json();
        setProviderData(data.provider);
      } catch (err) {
        setError('Failed to load provider data');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [providerId]);

  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error occurs, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='detailpage'>
      <div className="containers-limit detcol">
        <div className="detcol-1">
          <DetailIntro provider={providerData} />
          <AboutContainer  />
          <BusinessInfo  />
          <ServiceDiv  />
        </div>

        <div className="detcol-2">
          <div className="status-card">
            <div className="project-card">
              <h2 className="card-title">Status</h2>
              <p className="company-name">{providerData.name}</p>

              <label className="project-label" htmlFor="project">Select Project</label>

              <div className="select-wrapper">
                <select id="project" className="project-select">
                  <option>Building a house from the scratch</option>
                  <option>Renovating old property</option>
                  <option>Commercial construction</option>
                </select>
                <span className="arrow">▼</span>
              </div>

              <button className="send-btn">Send</button>
              <button className="add-btn">Add New Project</button>
            </div>
          </div>
        </div>
      </div>

      <div className="containers-limit">
        <TorranceSlider />
      </div>
    </div>
  );
};

export default Page;
