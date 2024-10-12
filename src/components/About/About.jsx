import React from 'react'
import './About.css'
import pic from './pic.jpg'
function About() {
  return (
        <section className='about' id='section2'>
        <h3>Why join us ?</h3>
        <div className="about-container">
        <div className="about-content">
          <div className='benefits'>
            <div className="we-do">
                <img src="./assets/bullet1.png" alt="" />
                <h3>Sharpen your communication and argumentation skills.</h3>
            </div>
            <div className="we-do">
                <img src="./assets/bullet2.png" alt="" />
                <h3>Build confidence in public speaking.</h3>
            </div>
            <div className="we-do">
                <img src="./assets/bullet3.png" alt="" />
                <h3>Learn how to organize and participate in competitions.</h3>
            </div>
            <div className="we-do">
                <img src="./assets/bullet4.png" alt="" />
                <h3>Get hands-on experience in event planning.</h3>
            </div>
            <div className="we-do">
                <img src="./assets/bullet5.png" alt="" />
                <h3>Improve your English while debating real-world topics.</h3>
            </div>
            </div>
        </div>
        <div className="about-img">
            <img src={pic} alt="" />
        </div>
        </div>
       
    </section>
  )
}

export default About