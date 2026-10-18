import React, { useMemo, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import './Tools.css'

const FORMATS = {
  bp: {
    label: 'British Parliamentary',
    range: [50, 100],
    def: 75,
    teams: [
      { name: 'Opening Government', speakers: ['Prime Minister', 'Deputy PM'] },
      { name: 'Opening Opposition', speakers: ['Leader of Opp.', 'Deputy Leader'] },
      { name: 'Closing Government', speakers: ['Member of Gov.', 'Gov. Whip'] },
      { name: 'Closing Opposition', speakers: ['Member of Opp.', 'Opp. Whip'] },
    ],
  },
  wsdc: {
    label: 'World Schools',
    range: [60, 80],
    def: 70,
    replyRange: [30, 40],
    replyDef: 35,
    teams: [
      { name: 'Proposition', speakers: ['1st Speaker', '2nd Speaker', '3rd Speaker', 'Reply'] },
      { name: 'Opposition', speakers: ['1st Speaker', '2nd Speaker', '3rd Speaker', 'Reply'] },
    ],
  },
}

const blank = (fmt) =>
  FORMATS[fmt].teams.map((t) => ({
    name: t.name,
    speakers: t.speakers.map((role) => ({
      role,
      name: '',
      score: role === 'Reply' ? FORMATS[fmt].replyDef : FORMATS[fmt].def,
    })),
  }))

function ScoreSheet() {
  const { user, isMember } = useAuth()
  const [format, setFormat] = useState('bp')
  const [motion, setMotion] = useState('')
  const [teams, setTeams] = useState(() => blank('bp'))
  const [status, setStatus] = useState(null)

  const cfg = FORMATS[format]

  const changeFormat = (f) => {
    setFormat(f)
    setTeams(blank(f))
    setStatus(null)
  }

  const update = (ti, si, field, value) => {
    setTeams((prev) =>
      prev.map((t, i) =>
        i !== ti ? t : { ...t, speakers: t.speakers.map((s, j) => (j !== si ? s : { ...s, [field]: value })) }
      )
    )
  }

  const results = useMemo(() => {
    const totals = teams.map((t) => ({ name: t.name, total: t.speakers.reduce((n, s) => n + (Number(s.score) || 0), 0) }))
    const ranked = [...totals].sort((a, b) => b.total - a.total)
    const tie = ranked.some((t, i) => i > 0 && t.total === ranked[i - 1].total)
    const speakers = teams
      .flatMap((t) => t.speakers.filter((s) => s.role !== 'Reply').map((s) => ({ ...s, team: t.name })))
      .sort((a, b) => b.score - a.score)
    return { ranked, tie, best: speakers[0] }
  }, [teams])

  const save = async () => {
    setStatus('saving')
    try {
      await addDoc(collection(db, 'scoresheets'), {
        format,
        motion,
        teams,
        ranking: results.ranked,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      })
      setStatus('saved')
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Judge score sheet</h1>
        <p>
          Speaker scores {cfg.range[0]}–{cfg.range[1]}
          {cfg.replyRange ? `, reply speeches ${cfg.replyRange[0]}–${cfg.replyRange[1]}` : ''}.
        </p>
      </div>

      <div className="row" style={{ marginBottom: '1.5rem' }}>
        <select value={format} onChange={(e) => changeFormat(e.target.value)} style={{ width: 'auto' }} aria-label="Format">
          {Object.entries(FORMATS).map(([k, f]) => (
            <option key={k} value={k}>
              {f.label}
            </option>
          ))}
        </select>
        <input
          value={motion}
          onChange={(e) => setMotion(e.target.value)}
          placeholder="Motion (optional)"
          style={{ flex: 1, minWidth: 220 }}
        />
      </div>

      <div className="score-grid">
        {teams.map((t, ti) => {
          const total = results.ranked.find((r) => r.name === t.name)?.total
          return (
            <div className="card" key={ti}>
              <div className="spread" style={{ marginBottom: '0.75rem' }}>
                <h3>{t.name}</h3>
                <span className="tag">{total}</span>
              </div>
              {t.speakers.map((s, si) => {
                const [min, max] = s.role === 'Reply' ? cfg.replyRange : cfg.range
                return (
                  <div className="score-row" key={si}>
                    <input
                      value={s.name}
                      onChange={(e) => update(ti, si, 'name', e.target.value)}
                      placeholder={s.role}
                      aria-label={`${t.name} ${s.role} name`}
                    />
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={s.score}
                      onChange={(e) => update(ti, si, 'score', e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => update(ti, si, 'score', Math.min(max, Math.max(min, Number(s.score) || min)))}
                      aria-label={`${t.name} ${s.role} score`}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Result</h3>
        <ol className="ranking">
          {results.ranked.map((r) => (
            <li key={r.name}>
              <strong>{r.name}</strong> <span className="muted">{r.total}</span>
            </li>
          ))}
        </ol>
        {results.tie && (
          <p className="notice notice-warning" style={{ marginTop: '0.75rem' }}>
            Two teams have the same total. Adjust the scores so every team has a distinct rank.
          </p>
        )}
        {results.best && (
          <p style={{ marginTop: '0.75rem' }}>
            Best speaker: <strong>{results.best.name || results.best.role}</strong>{' '}
            <span className="muted">
              ({results.best.team}, {results.best.score})
            </span>
          </p>
        )}
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => changeFormat(format)}>
            Clear
          </button>
          {isMember && (
            <button className="btn btn-primary" onClick={save} disabled={status === 'saving' || status === 'saved'}>
              {status === 'saved' ? 'Saved' : 'Save to club records'}
            </button>
          )}
        </div>
        {status === 'error' && <p className="notice notice-error">Could not save. Please try again.</p>}
      </div>
    </div>
  )
}

export default ScoreSheet
