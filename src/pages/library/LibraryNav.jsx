import React from 'react'
import { NavLink } from 'react-router-dom'

function LibraryNav() {
  const cls = ({ isActive }) => (isActive ? 'tab active' : 'tab')
  return (
    <nav className="tabs">
      <NavLink to="/library" end className={cls}>
        Motions
      </NavLink>
      <NavLink to="/library/formats" className={cls}>
        Formats
      </NavLink>
      <NavLink to="/library/practice" className={cls}>
        Practice
      </NavLink>
    </nav>
  )
}

export default LibraryNav
