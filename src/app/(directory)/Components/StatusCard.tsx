import React from 'react'

const StatusCard = () => {
  return (
     <div className="status-card">
                <div className="project-card">
      <h2 className="card-title">Status</h2>
      <p className="company-name">American House Improvements Inc.</p>

      <label className="project-label" htmlFor="project">
        Select Project
      </label>

      <div className="select-wrapper">
        <select id="project" className="project-select">
          <option>Building a house from the scratch</option>
          <option>Renovating old property</option>
          <option>Commercial construction</option>
        </select>
        <span className="arrow">▼</span>
      </div>

      <button className="send-btn">Edit</button>

      <button className="add-btn">Add New Project</button>
    </div>

            </div>
  )
}

export default StatusCard

