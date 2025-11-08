'use client'
import React, { useEffect, useState } from 'react'
import AboutContainer from '../../Components/AboutContainer'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import ServiceDiv from '../../Components/ServiceDiv'
import TorranceSlider from '../../Components/TorranceSlider'

const Page = () => {
  const [providerData, setProviderData] = useState(null)
  const providerId = 8 // Replace this with the logged-in user's providerId (or dynamic param)

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(`https://hanois.dotwibe.com/api/api/providers/${providerId}`)
        const data = await res.json()
        setProviderData(data.provider)
      } catch (error) {
        console.error('Error fetching provider data:', error)
      }
    }

    fetchProvider()
  }, [providerId])

  if (!providerData) {
    return <div className="containers-limit py-10 text-center">Loading provider details...</div>
  }

  return (
    <div className='detailpage'>
      <div className="containers-limit detcol">
        <div className="detcol-1">
          {/* Pass provider data dynamically */}
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

              <label className="project-label" htmlFor="project">
                Select Project
              </label>

              <div className="select-wrapper">
                <select id="project" className="project-select">
                  <option>Building a house from scratch</option>
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
  )
}

export default Page
