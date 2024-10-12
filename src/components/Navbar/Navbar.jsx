import React, { useState } from 'react'
import './Navbar.css'
import MobileNav from '../MobileNav/MobileNav'
import { Link, animateScroll as scroll } from 'react-scroll'

function Navbar() {

  const [openMenu, setOpenMenu] = useState(false)

  const toggleMenu = () => {
    setOpenMenu(!openMenu)
  }

  return (
    <>
      <MobileNav isOpen={openMenu} toggleMenu={toggleMenu} />

      <nav className="nav-wrapper">
        <div className="nav-content">
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

          <button className="menu-btn" onClick={() => {toggleMenu()}}>
            <span className="material-symbols-outlined" style={{fontSize: "1.8rem"}}>{openMenu ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar