import React, { useMemo, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useMotions } from '../../lib/useMotions'
import { TOPICS, DIFFICULTIES } from '../../data/motions'
import LibraryNav from './LibraryNav'

function SuggestMotion() {
  const { user, isAdmin } = useAuth()
  const [form, setForm] = useState({ text: '', topic: TOPICS[0], difficulty: DIFFICULTIES[0], infoSlide: '' })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await addDoc(collection(db, 'motions'), {
        ...form,
        text: form.text.trim(),
        approved: isAdmin,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      })
      setForm({ ...form, text: '', infoSlide: '' })
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <form className="card form" onSubmit={submit} style={{ marginBottom: '2rem' }}>
      <h3>{isAdmin ? 'Add a motion' : 'Suggest a motion'}</h3>
      <input
        required
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        placeholder="This House would..."
        aria-label="Motion"
      />
      <input
        value={form.infoSlide}
        onChange={(e) => setForm({ ...form, infoSlide: e.target.value })}
        placeholder="Info slide (optional)"
        aria-label="Info slide"
      />
      <div className="row">
        <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} style={{ width: 'auto' }}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          style={{ width: 'auto' }}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <button className="btn btn-primary" disabled={status === 'saving'}>
          {isAdmin ? 'Add' : 'Suggest'}
        </button>
      </div>
      {status === 'saved' && (
        <p className="notice notice-success">{isAdmin ? 'Motion added.' : 'Thanks! An admin will review your motion.'}</p>
      )}
      {status === 'error' && <p className="notice notice-error">Could not save. Please try again.</p>}
    </form>
  )
}

function Motions() {
  const { isMember } = useAuth()
  const { motions, usingSeed } = useMotions()
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    const s = search.toLowerCase()
    return motions
      .filter(
        (m) =>
          (!topic || m.topic === topic) &&
          (!difficulty || m.difficulty === difficulty) &&
          (!s || m.text.toLowerCase().includes(s))
      )
      .sort((a, b) => a.topic.localeCompare(b.topic))
  }, [motions, search, topic, difficulty])

  return (
    <div className="container page">
      <div className="page-head spread">
        <div>
          <h1>Library</h1>
          <p>Motions to practise with, debate formats and training drills.</p>
        </div>
        {isMember && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span> Motion
          </button>
        )}
      </div>
      <LibraryNav />

      {showForm && <SuggestMotion />}

      <div className="row" style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search motions"
          style={{ flex: 1, minWidth: 200 }}
          aria-label="Search motions"
        />
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

      {usingSeed && <p className="muted small" style={{ marginBottom: '1rem' }}>Showing the starter motion set.</p>}

      <div className="stack">
        {filtered.map((m) => (
          <div className="card" key={m.id}>
            <p style={{ fontWeight: 600 }}>{m.text}</p>
            {m.infoSlide && <p className="muted small">Info slide: {m.infoSlide}</p>}
            <div className="row" style={{ marginTop: '0.5rem' }}>
              <span className="tag">{m.topic}</span>
              <span className="tag tag-muted">{m.difficulty}</span>
            </div>
          </div>
        ))}
        {!filtered.length && <p className="muted center">No motions match.</p>}
      </div>
    </div>
  )
}

export default Motions
