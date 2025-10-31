import React from 'react'

const ChoosePlan = () => {
  return (
    <div className='chooseplan'>
      <div className="containers">

        <h3>Choose the right plan for your business</h3>



         <div className="pricing-container">
      {/* Starter Plan */}
      <div className="pricing-card">
        <h3 className="plan-title">Starter</h3>
        <div className="price">
          $00,00 <span className="per-month">/month</span>
        </div>
        <p className="description">
          One time fee for one listing or task highlighted in search results.
        </p>
        <hr />
        <ul className="features">
          <li>✓ Directory Listing</li>
          <li>✓ 10$ Per lead</li>
        </ul>
        <button className="btn-outline">Sign up</button>
      </div>

      {/* Professional Plan */}
      <div className="pricing-card highlighted">
        <div className="recommended">Recommended</div>
        <h3 className="plan-title">Professional</h3>
        <div className="price">
          $59,00 <span className="per-month">/month</span>
        </div>
        <p className="description">
          One time fee for one listing or task highlighted in search results.
        </p>
        <hr />
        <ul className="features">
          <li>✓ Directory Listing</li>
          <li>✓ 10 Free Qualified Leads/month</li>
          <li>✓ 7$ per qualified lead</li>
          <li>✓ Unlimited portfolio projects</li>
          <li>✓ Support 24/7</li>
        </ul>
        <button className="btn-filled">Sign Up</button>
      </div>
    </div>


      </div>
    </div>
  )
}

export default ChoosePlan