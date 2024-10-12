import React from 'react'
import './ContactMe.css'

function ContactMe() {
  return (
    <section className="contact-container" id='section5'>
        <div className="contact-content">
            <h2><span>Join us</span></h2>
            <p>
            Are you eager to enhance your communication and leadership skills? Reach out to our club leader,<a href='https://www.facebook.com/profile.php?id=100078745841555' target="_blank" rel="noopener noreferrer" className='mr-sami'> Mr. Sami Hamami</a>, for more information on how to join or attend our sessions!
            </p>
            <div className="links">
            <a href="https://www.facebook.com/profile.php?id=100080271585446" target="_blank" rel="noopener noreferrer" className="fa fa-facebook"></a>
            <a href="https://www.instagram.com/we.debate_club/" target="_blank" rel="noopener noreferrer" className="fa fa-instagram"></a>
            </div>
        </div>
    </section>
  )
}

export default ContactMe