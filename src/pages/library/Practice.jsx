import React from 'react'
import { Link } from 'react-router-dom'
import { PRACTICE } from '../../data/formats'
import LibraryNav from './LibraryNav'

function Practice() {
  return (
    <div className="container page">
      <div className="page-head">
        <h1>Library</h1>
        <p>Drills for speech practice weeks. Pick one, set the timer and go.</p>
      </div>
      <LibraryNav />

      <div className="grid">
        {PRACTICE.map((p) => (
          <div className="card" key={p.title}>
            <h3>{p.title}</h3>
            <p className="muted small">{p.desc}</p>
            {p.tool && (
              <Link to={p.tool} className="btn btn-sm" style={{ marginTop: '1rem' }}>
                Open tool
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Practice
