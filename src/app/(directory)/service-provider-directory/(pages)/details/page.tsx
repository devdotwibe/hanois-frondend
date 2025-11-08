// app/providers/[id]/page.jsx
import React from 'react'
import DetailIntro from '@/app/(directory)/Components/DetailIntro'
import AboutContainer from '../../Components/AboutContainer'
import ItemSlider from '@/app/(provider)/provider/dashboard/Components/ItemSlider'
import BusinessInfo from '@/app/(directory)/Components/BusinessInfo'
import ServiceDiv from '../../Components/ServiceDiv'
import TorranceSlider from '../../Components/TorranceSlider'

const API_BASE = 'https://hanois.dotwibe.com/api/api/providers'

async function getProvider(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      // server fetch — don't cache or set your caching policy as needed
      // to revalidate use: { next: { revalidate: 60 } }
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch provider ${id}: ${res.status}`)
    }

    const data = await res.json()
    // API returns { provider: { ... } }
    return data.provider ?? null
  } catch (err) {
    console.error(err)
    return null
  }
}

const Page = async ({ params }) => {
  // if you're using route /providers/[id], `params.id` will be available.
  const id = params?.id ?? '8' // fallback to 8 for local testing
  const provider = await getProvider(id)

  if (!provider) {
    return (
      <div className="detailpage">
        <div className="containers-limit">
          <h2>Provider not found</h2>
          <p>Unable to load provider data for id: {id}</p>
        </div>
      </div>
    )
  }

  // construct full image URL if API returns a relative path
  const imageUrl = provider.image
    ? provider.image.startsWith('http')
      ? provider.image
      : `https://hanois.dotwibe.com${provider.image}`
    : null

  return (
    <div className="detailpage">
      <div className="containers-limit detcol">
        <div className="detcol-1">
          {/* pass the provider data down to children */}
          <DetailIntro
            name={provider.name}
            description={provider.professional_headline ?? provider.service ?? ''}
            image={imageUrl}
          />

          {/* pass provider to AboutContainer etc — update those components to accept props if needed */}
          <AboutContainer />

          <BusinessInfo />

          <ServiceDiv />

          {/* Example: pass provider.service or provider.service_id to ItemSlider */}
          {/* <ItemSlider /> */}
        </div>

        <div className="detcol-2">
          <div className="status-card">
            <div className="project-card">
              <h2 className="card-title">Status</h2>

              {/* show provider name dynamically */}
              <p className="company-name">{provider.name}</p>

              <label className="project-label" htmlFor="project">
                Select Project
              </label>

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
        {/* pass provider or provider.id to TorranceSlider if it needs to fetch related items */}
        <TorranceSlider />
      </div>
    </div>
  )
}

export default Page
