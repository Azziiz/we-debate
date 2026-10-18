import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container page center stack" style={{ alignItems: 'center', paddingTop: '6rem' }}>
      <h1 style={{ fontSize: '4rem' }} className="highlight">404</h1>
      <p className="muted">This page lost the debate. It does not exist.</p>
      <Link to="/" className="btn">
        Back home
      </Link>
    </div>
  )
}

export default NotFound
