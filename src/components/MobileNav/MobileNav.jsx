import React from 'react'
import './MobileNav.css'
import { Link } from 'react-scroll'

function MobileNav({isOpen, toggleMenu}) {
  return (
    <>
        <div className={`mobile-menu ${isOpen? "active" : ""}`} onClick={toggleMenu}>
            <div className="mobile-menu-container">
            <div className='logo'>
            <img src="./assets/logo.png" alt="" />
          </div>
            <ul>
            <li>
             <Link to="section1" smooth={true} duration={500} offset={-100}><a  className="menu-item">HOME</a></Link>
            </li>
            <li>
            <Link to="section2" smooth={true} duration={500} offset={-100}> <a  className="menu-item">Benefits</a></Link>
            </li>
            <li>
            <Link to="section3" smooth={true} duration={500} offset={-100}> <a className="menu-item">Activities</a></Link>
            </li>
            <li>
            <Link to="section4" smooth={true} duration={500} offset={-100}><a  className="menu-item">Achievements</a></Link>
            </li>
            <li><Link to="section5" smooth={true} duration={500} offset={-100}><button className="button">join us</button></Link></li>

          </ul>
            </div>
        </div>
    </>
  )
}

export default MobileNav