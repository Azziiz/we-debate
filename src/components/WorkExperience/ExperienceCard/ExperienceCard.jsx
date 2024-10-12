import React from 'react'
import './ExperienceCard.css'

function ExperienceCard({details}) {


  return (
    <div className="work-experience-card">
        <img src={details.icon} alt="" />
        <h6>{details.title}</h6>
        <h3>{details.desc}</h3>
      </div>

  )
}

export default ExperienceCard