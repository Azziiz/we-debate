import React from 'react'
import './Hero.css'
import { Link } from 'react-scroll'


function Hero() {
  return (
    <section className="hero-container" id='section1'>
        <div className="hero-content">
            <h2>Join Our Debating Club Where <span>Ideas Matter!</span></h2>
            <p>
            Engage in meaningful debates, improve your public speaking, and connect with like-minded individuals.
            </p>
            <Link to="section5" smooth={true} duration={500} offset={-100}><button className="join">join us</button></Link>
        </div>
    </section>
  )
}

export default Hero