import React from 'react'
import { Link } from 'react-router-dom'

const TOOLS = [
  {
    to: '/tools/timer',
    icon: 'timer',
    title: 'Speech timer',
    desc: 'BP, World Schools and club presets with protected time and bells. Goes full screen for the room.',
  },
  {
    to: '/tools/motion',
    icon: 'casino',
    title: 'Motion generator',
    desc: 'Draw a random motion from the club library, filtered by topic and difficulty.',
  },
  {
    to: '/tools/draw',
    icon: 'groups',
    title: 'Team & role draw',
    desc: 'Enter the names in the room and randomly assign teams and speaker positions.',
  },
  {
    to: '/tools/score',
    icon: 'scoreboard',
    title: 'Judge score sheet',
    desc: 'Score each speaker, get team totals and rankings automatically.',
  },
]

function Tools() {
  return (
    <div className="container page">
      <div className="page-head">
        <h1>Debate tools</h1>
        <p>Everything you need to run a debate from your phone. No account needed.</p>
      </div>
      <div className="grid">
        {TOOLS.map((t) => (
          <Link to={t.to} key={t.to} className="card card-link">
            <span className="material-symbols-outlined" style={{ fontSize: '2.2rem', color: 'var(--green)' }}>
              {t.icon}
            </span>
            <h3 style={{ marginTop: '0.75rem' }}>{t.title}</h3>
            <p className="muted small">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Tools
