import React from 'react'
import ProjectList from '../../Components/ProjectList'
import PublicIntro from '../../Components/PublicIntro'
import FilterBy from '../../Components/FilterBy'

const page = () => {
  return (
    <div className='public-project-page e-main'>

        <PublicIntro />

        <ProjectList />

        <FilterBy />

    </div>
  )
}

export default page
