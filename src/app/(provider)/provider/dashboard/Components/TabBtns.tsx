import React from 'react';

import { SITE_URL } from "@/config";

const TabBtns = () => {
  return (
    <div className='proj-top'>
      <ul className="tab-nav1">
        <li>
          <button
            className="tab-btn"
            onClick={() => window.location.href = `${SITE_URL}provider/dashboard/company-profile`}
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
