import React from 'react'

const BudjectCalculator = () => {
  return (
    

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
                                    <p><strong>Design Fee Cost</strong></p>
                                    <p><span className="cost-value">1,177</span> (5%)</p>
                                </div>

                                <div className="bud-row">
                                    <p><strong>Total Project Cost</strong></p>
                                    <p><span className="">118,877</span></p>
                                </div>
                            </div>

            </div>
    </div>



      
   
  )
}

export default BudjectCalculator
