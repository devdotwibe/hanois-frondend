import React from 'react';

const TabBtns = () => {
  return (
    <div className='proj-top'>
      <ul className="tab-nav1">
        <li>
          <button
            className="tab-btn"
            onClick={() => window.location.href = 'https://hanois.dotwibe.com/provider/dashboard/company-profile'}
          >
            Company Information
          </button>
        </li>
        <li>
          <button className="tab-btn active">
            Project
          </button>
        </li>
      </ul>
    </div>
  );
}

export default TabBtns;
