import React from 'react'
import DetailCard from '@/app/(directory)/Components/DetailCard'

const DetailIntro = ({ provider }) => {
  const imageUrl = provider?.image
    ? `https://hanois.dotwibe.com${provider.image}`
    : '/images/default-logo.png'

  return (
    <div className="detail-page-intro">
      <DetailCard
        logo={imageUrl}
        name={provider.name}
        description={provider.professional_headline || provider.service || 'No description available'}
      />
    </div>
  )
}

export default DetailIntro
