import React from 'react'
import './Achievements.css'
import pic from './circle.jpg'
function Achievements() {
  return (
        <section className='Achievement' id='section4'>
        <h3>Achievements</h3>
        <div className="Achievement-container">
            <div className="Achievement-content">
            <div className='benefits'>
                <div className="we-do">
                    <img src="./assets/Achievement1.png" alt="" />
                    <h3>Successfully hosted "The Circle" for 7 consecutive years.</h3>
                </div>
                <div className="we-do">
                    <img src="./assets/Achievement2.png" alt="" />
                    <h3>Recognized in academic and high school communities for outstanding events.</h3>
                </div>
                <div className="we-do">
                    <img src="./assets/Achievement3.png" alt="" />
                    <h3>Debated against various schools, fostering competitive spirit and collaboration.</h3>
                </div>
                <div className="we-do">
                    <img src="./assets/Achievement4.png" alt="" />
                    <h3>Built a strong reputation, attracting students from across the region.</h3>
                </div>

            </div>
        </div>

        <div className="Achievement-img">
            <img src={pic} alt="" />
        </div>
        </div>
       
    </section>
  )
}

export default Achievements