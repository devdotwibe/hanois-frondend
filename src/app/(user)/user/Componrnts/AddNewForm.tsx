import React from 'react'

const AddNewForm = () => {
  return (
    <div className='add-newformouter'>
        <h2>Add New Project</h2>

        <form className='addproject-form'>


            <div className="form-grp">
                <label>Title</label>
                <input placeholder="Title"></input>
            </div>


            <div className="form-grp">
                <label>Notes</label>
               <textarea id="notes" placeholder="Add notes"  rows={4}></textarea>
               <small>Brief description for your profile. URLs are hyperlinked.</small>
            </div>


            <div className="form-grp">
                <label>Project Type</label>
                <input placeholder="Title"></input>
            </div>

            <div className="form-grp">
                <label>Location</label>
                <input placeholder="Kuwait City"></input>
            </div>

            <div className="form-grp">
                <label>Land size</label>
                <input placeholder="115 m2"></input>
            </div>


            <div className="form-grp">
                <label>Luxury level</label>
                <input placeholder="Luxury level"></input>
            </div>


            <div className="form-grp">
                <label>Select Services</label>
                <input placeholder="Select Services"></input>
            </div>



            <div className="form-grp">
                <label>construction Budget</label>
                <input placeholder="$150, 000"></input>
            </div>


        <div className="radio-group">
    <h5>Do you have a Basement?</h5>



    <div className="radio-row">

            <div className="radio-col">
        <label className="radio-option">
        <input type="radio" name="listing" value="private" />
        <span className="radio-custom"></span>
        Yes
    </label>
        
    </div>


    <div className="radio-col">
         <label className="radio-option">
        <input type="radio" name="listing" value="public" />
        <span className="radio-custom"></span>
        No
    </label>


    </div>
    

    </div>


    
    
   


</div>


           <div className="form-grp listing-styleouter">
    <h5>Listing style</h5>

    <div className="listing-style">

            <button className='private-btn'>Private</button>
            <button className='public-btn'>Public</button>


    </div>


    <ul className='listing-ul'>

        <li>Public projects will be pushed to all the service providers in the director</li>
        <li>Private projects will be invite only</li>

    </ul>



            </div>


             <div className="budget-calc">
                <h2>Budget Calculator</h2>
                <div className="budget-calculator">



                    <div className="bud-col1">


                        <div className="bud-row">
                         
                            
                           <p><strong>Total max buildable area</strong></p>

                           <p><span className="">870</span></p>

                        </div>
                    
                        <div className="bud-row">
                            

                            <p><strong>Cost with finish</strong></p>
                           <p><span className="">117 700</span></p>

                        </div>
                    

                          
                            
                      
                    </div>


                    
                    <div className="bud-col1 bud-col2">


                        
                        <div className="bud-row">
                            <p>
                                <strong>Design Fee Cost</strong>
                                </p>
                            <p><span className="cost-value">
                              
                               1,177</span> (5%)</p>
                        </div>

                        <div className="bud-row">
                            <p><strong>Total Project Cost</strong></p>
                            <p><span className="">118,877</span></p>
                        </div>



                    </div>

                    






                </div>



            </div>


            <div className="create-btn-container">

                        <button className='create-btn'>Create</button>

            </div>











        </form>


      
    </div>
  )
}

export default AddNewForm
