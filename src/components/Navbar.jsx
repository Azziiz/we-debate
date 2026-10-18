import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { firebaseReady } from '../firebase'
import Avatar from './Avatar'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events' },
  { to: '/tools', label: 'Tools' },
  { to: '/library', label: 'Library' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/gallery', label: 'Gallery' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className="nav-wrapper">
      <nav className="nav-content container">
        <Link to="/" className="logo" aria-label="We Debate Club home">
          <img src="/assets/logo.png" alt="We Debate Club" />
        </Link>

        <ul className={open ? 'nav-links open' : 'nav-links'}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className="menu-item">
                {l.label}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className="menu-item">
                Admin
              </NavLink>
            </li>
          )}
          <li className="nav-cta">
            {user ? (
              <Link to="/profile" className="nav-profile">
                <Avatar name={profile?.name} src={profile?.photoURL} size={34} />
                <span>{profile?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
            ) : (
              <>
                {firebaseReady && (
                  <Link to="/login" className="btn btn-ghost btn-sm">
                    Log in
                  </Link>
                )}
                <Link to="/join" className="btn btn-sm">
                  Join us
                </Link>
              </>
            )}
          </li>
        </ul>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
