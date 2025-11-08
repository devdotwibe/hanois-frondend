// app/(directory)/Components/DetailIntro.jsx
import React from 'react'
import DetailCard from '@/app/(directory)/Components/DetailCard'
import Image from 'next/image'

const DetailIntro = ({ name, description, image }) => {
  // If you want to keep a default local logo, import it and use as fallback
  // import logoFallback from '../../../../public/images/ahi-logo.jpg'
  // const logoSrc = image ?? logoFallback

  return (
    <div className="detail-page-intro">
      <div className="">
        <DetailCard
          // DetailCard should accept logo, name, description. If not, update it similarly.
          logo={image}
          name={name ?? 'Unknown Provider'}
          description={description ?? ''}
        />

        {/* If DetailCard doesn't handle an image prop, you can also render here: */}
        {/* {image && (
          <div className="provider-image">
            <Image src={image} alt={name ?? 'provider image'} width={120} height={120} />
          </div>
        )} */}
      </div>
    </div>
  )
}

export default DetailIntro
