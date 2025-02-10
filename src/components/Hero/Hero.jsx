import React from 'react'
import './Hero.css'
import { Link } from 'react-scroll'


function Hero() {
  return (
    <section className="hero-container" id='section1'>
        <div className="hero-content">
            <h2> The Circle 2025 Is Almost <span>Here!</span></h2>
            <p>
            Our annual event is just around the corner—secure your spot now!
            Only 15 places left! Fill out the form to join before it’s too late!
            </p>
            <a href="https://forms.gle/CvXkq8qWYzGAuXxa9" target="_blank" rel="noopener noreferrer"><button className="join">fill the form</button></a>
        </div>
    </section>
  )
}

export default Hero