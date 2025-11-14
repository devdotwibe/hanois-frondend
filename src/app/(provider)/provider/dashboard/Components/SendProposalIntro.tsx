import React from 'react'
import Image from 'next/image'

import Image1 from "../../../../../../public/images/left-arrow.svg"
import Link from 'next/link'

import Uploadimg from "../../../../../../public/images/upload.svg"

const SendProposalIntro = () => {
  return (
    <div>
         <div className="intro-tab">
              <button className="back-bth">
            <Image src={Image1} alt="Back" width={40} height={40} />
       </button>

       <h3>Send Proposal</h3>

       <form>
        <div className="form-grp">
            <label className='dark'>Proposal Title</label>
            <input placeholder="Proposal Title"></input>

        </div>
        
        <div className="form-grp">
            <label className='dark'>Budget</label>
            <input placeholder="$150.000"></input>

        </div>
        
        <div className="form-grp">
            <label className='dark'>Timeline</label>
            <input placeholder="6 months"></input>
        </div>
        <div className="form-grp">
            <label>Proposal Letter</label>
            <textarea placeholder="Proposal Letters" rows={4}></textarea>
            <small>Breif discription for your profile, URLs are hyperlinked </small>
        </div>


            <div className="upload-doc">
            <div className="form-grp upload-area">
  <div>
    {/* Upload Box inside grid */}
    <div
      className="upload-box"
    >

      <div className="cover-upload">
        <div className="img-cover-up">
           <Image src={Uploadimg} alt="Upload Icon" width={40} height={40} />


        </div>

        
      <h3>Upload an image</h3>
      <p>
        Browse your files to upload document
      </p>
      <span>
        Supported Formats: JPEG, PNG
      </span>


      </div>







      <input
      type="file"
      accept="image/*"
     
    />
    </div>


    

   
  </div>

 
</div>

        </div>




        <Link href="/" className='send-prop-btn dark-btn' >Send Proposal</Link>


    







        
       </form>





        </div>
      
    </div>
  )
}

export default SendProposalIntro
