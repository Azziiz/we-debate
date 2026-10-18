import React from 'react'
import { Link } from 'react-router-dom'
import { SOCIALS } from '../data/club'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <img src="/assets/logo.png" alt="We Debate Club" className="footer-logo" />
          <p className="muted small">For the thinkers, the challengers, the loud minds.</p>
          <p className="muted small">Djerba, Tunisia</p>
        </div>
        <div className="footer-links">
          <Link to="/events">Events</Link>
          <Link to="/tools">Debate tools</Link>
          <Link to="/library">Motion library</Link>
          <Link to="/join">Join us</Link>
        </div>
        <div className="footer-links">
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">
            Facebook group
          </a>
        </div>
      </div>
      <p className="center muted small footer-copy">© {new Date().getFullYear()} We Debate Club</p>
    </footer>
  )
}

export default Footer
