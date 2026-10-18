import React from 'react'
import { Link } from 'react-router-dom'
import { FORMATS } from '../../data/formats'
import LibraryNav from './LibraryNav'

function Formats() {
  return (
    <div className="container page">
      <div className="page-head">
        <h1>Library</h1>
        <p>How the main debate formats work.</p>
      </div>
      <LibraryNav />

      <div className="stack">
        {FORMATS.map((f) => (
          <article className="card" key={f.id} id={f.id}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{f.name}</h2>
            <p className="muted">{f.summary}</p>

            <div className="grid" style={{ marginTop: '1.25rem' }}>
              <div>
                <h3>Teams</h3>
                <ul className="small">
                  {f.teams.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Speaking order</h3>
                <ol className="small">
                  {f.order.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3>Timing</h3>
                <p className="small">{f.timing}</p>
                <p className="small muted" style={{ marginTop: '0.4rem' }}>
                  Prep: {f.prep}
                </p>
              </div>
            </div>

            <h3 style={{ marginTop: '1.25rem' }}>Tips</h3>
            <ul className="small">
              {f.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <div className="row" style={{ marginTop: '1.25rem' }}>
              <Link to={`/tools/timer?preset=${f.id}`} className="btn btn-sm">
                Open timer
              </Link>
              {f.id !== 'club' && (
                <Link to="/tools/draw" className="btn btn-sm btn-ghost">
                  Draw teams
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Formats
