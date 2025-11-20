import React from 'react'

const Intro = ({ query, onQueryChange, total }) => {
  return (
    <div className=''>

      <div className="intro-tab">

      <h3>Service Provider List</h3>
      <p>Here is the list of your leads, you can check lead’s projects and contact with them</p>

      </div>




      <div className="form-grp wrap-select">
        <input
          type="text"
          placeholder="Search by name, service or location"
          className=""
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <small style={{display:'block', marginTop:8}}>{total ?? 0} total providers</small>
      </div>
    </div>
  )
}

export default Intro

// import React from 'react'

// const Intro = () => {
//   return (
//     <div className='intro-div'>
//         <h3>Service Provider List</h3>
//         <p>Here is the list of your leads, you can check lead’s projects and contact with them</p>

//         <div className="form-grp">
//         <input
//         type="text"
//         placeholder="Search"
//         className=""
//         />

//         </div>



//     </div>
//   )
// }

// export default Intro

