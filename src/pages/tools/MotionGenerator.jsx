import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMotions } from '../../lib/useMotions'
import { TOPICS, DIFFICULTIES } from '../../data/motions'
import './Tools.css'

function MotionGenerator() {
  const { motions } = useMotions()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [current, setCurrent] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const pool = useMemo(
    () => motions.filter((m) => (!topic || m.topic === topic) && (!difficulty || m.difficulty === difficulty)),
    [motions, topic, difficulty]
  )

  const draw = () => {
    if (!pool.length) return
    setSpinning(true)
    let n = 0
    // quick shuffle animation before landing on the motion
    const id = setInterval(() => {
      const options = pool.length > 1 ? pool.filter((m) => m.id !== current?.id) : pool
      setCurrent(options[Math.floor(Math.random() * options.length)])
      if (++n >= 10) {
        clearInterval(id)
        setSpinning(false)
      }
    }, 70)
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Motion generator</h1>
        <p>{pool.length} motions match your filters.</p>
      </div>

      <div className="row" style={{ marginBottom: '1.5rem' }}>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: 'auto' }} aria-label="Topic">
          <option value="">All topics</option>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ width: 'auto' }}
          aria-label="Difficulty"
        >
          <option value="">Any difficulty</option>
          {DIFFICULTIES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className={`card motion-display ${spinning ? 'spinning' : ''}`}>
        {current ? (
          <>
            <div className="row" style={{ justifyContent: 'center' }}>
              <span className="tag">{current.topic}</span>
              <span className="tag tag-muted">{current.difficulty}</span>
            </div>
            <p className="motion-text">{current.text}</p>
            {current.infoSlide && <p className="muted small">Info slide: {current.infoSlide}</p>}
          </>
        ) : (
          <p className="muted">Press the button to draw a motion.</p>
        )}
      </div>

      <div className="row" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
        <button className="btn btn-primary" onClick={draw} disabled={!pool.length || spinning}>
          <span className="material-symbols-outlined">casino</span> {current ? 'Draw another' : 'Draw a motion'}
        </button>
        {current && !spinning && (
          <Link to="/tools/timer?preset=prep" className="btn btn-ghost">
            <span className="material-symbols-outlined">timer</span> Start 15 min prep
          </Link>
        )}
      </div>
    </div>
  )
}

export default MotionGenerator
