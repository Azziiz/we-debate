import React, { useState } from 'react'
import { shuffle } from '../../lib/format'
import './Tools.css'

const MODES = {
  bp: {
    label: 'British Parliamentary',
    teams: [
      { name: 'Opening Government', roles: ['Prime Minister', 'Deputy Prime Minister'] },
      { name: 'Opening Opposition', roles: ['Leader of Opposition', 'Deputy Leader of Opposition'] },
      { name: 'Closing Government', roles: ['Member of Government', 'Government Whip'] },
      { name: 'Closing Opposition', roles: ['Member of Opposition', 'Opposition Whip'] },
    ],
  },
  wsdc: {
    label: 'World Schools (3 v 3)',
    teams: [
      { name: 'Proposition', roles: ['1st Speaker', '2nd Speaker', '3rd Speaker'] },
      { name: 'Opposition', roles: ['1st Speaker', '2nd Speaker', '3rd Speaker'] },
    ],
  },
  two: { label: 'Two equal sides', teams: null },
}

function parseNames(text) {
  const seen = new Set()
  return text
    .split(/[\n,]/)
    .map((n) => n.trim())
    .filter((n) => {
      const key = n.toLowerCase()
      if (!n || seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function TeamDraw() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('bp')
  const [result, setResult] = useState(null)

  const names = parseNames(text)
  const config = MODES[mode]
  const needed = config.teams ? config.teams.reduce((n, t) => n + t.roles.length, 0) : 2

  const draw = () => {
    const pool = shuffle(names)
    if (!config.teams) {
      const half = Math.ceil(pool.length / 2)
      setResult({
        teams: [
          { name: 'Side A', members: pool.slice(0, half).map((n) => ({ name: n })) },
          { name: 'Side B', members: pool.slice(half).map((n) => ({ name: n })) },
        ],
        extra: [],
      })
      return
    }
    let i = 0
    const teams = config.teams.map((t) => ({
      name: t.name,
      members: t.roles.map((role) => ({ role, name: pool[i++] || '(empty)' })),
    }))
    setResult({ teams, extra: pool.slice(i) })
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Team & role draw</h1>
        <p>One name per line (or separated by commas). Duplicates are ignored.</p>
      </div>

      <div className="draw-layout">
        <div className="stack">
          <div className="field">
            <label htmlFor="mode">Format</label>
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              {Object.entries(MODES).map(([k, m]) => (
                <option key={k} value={k}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="names">Names ({names.length})</label>
            <textarea
              id="names"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'Amira\nYoussef\nSarra\n...'}
            />
          </div>
          {config.teams && names.length > 0 && names.length < needed && (
            <p className="notice notice-warning">
              {config.label} needs {needed} speakers. You have {names.length}; some spots will be empty.
            </p>
          )}
          {config.teams && names.length > needed && (
            <p className="muted small">{names.length - needed} extra people will be listed as judges / audience.</p>
          )}
          <button className="btn btn-primary" onClick={draw} disabled={names.length < 2}>
            <span className="material-symbols-outlined">shuffle</span> Draw teams
          </button>
        </div>

        <div>
          {result ? (
            <div className="draw-result">
              {result.teams.map((t) => (
                <div className="card" key={t.name}>
                  <h3>{t.name}</h3>
                  <ul className="draw-list">
                    {t.members.map((m, k) => (
                      <li key={k}>
                        {m.role && <span className="muted small">{m.role}</span>}
                        <strong>{m.name}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {result.extra.length > 0 && (
                <div className="card">
                  <h3>Judges / audience</h3>
                  <p>{result.extra.join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card center muted">The draw will appear here.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamDraw
