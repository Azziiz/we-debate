import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, doc, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../lib/useCollection'
import { formatDate, toDate } from '../lib/format'
import Avatar from '../components/Avatar'

const ROLE_LABEL = { guest: 'Guest', member: 'Member', admin: 'Admin' }

function Profile() {
  const { user, profile, logout, isMember } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '' })
  const [error, setError] = useState('')

  const { docs: points } = useCollection(() => query(collection(db, 'points'), where('uid', '==', user.uid)), [user.uid])
  const history = useMemo(() => [...points].sort((a, b) => toDate(b.createdAt) - toDate(a.createdAt)), [points])

  if (!profile) return null

  const startEdit = () => {
    setForm({ name: profile.name, bio: profile.bio || '' })
    setEditing(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: form.name.trim(), bio: form.bio.trim() })
      setEditing(false)
    } catch (err) {
      console.error(err)
      setError('Could not save your profile.')
    }
  }

  return (
    <div className="container page" style={{ maxWidth: 800 }}>
      <div className="card">
        <div className="spread">
          <div className="row">
            <Avatar name={profile.name} src={profile.photoURL} size={72} />
            <div>
              <h1 style={{ fontSize: '1.6rem' }}>{profile.name}</h1>
              <span className={profile.role === 'guest' ? 'tag tag-muted' : 'tag'}>{ROLE_LABEL[profile.role]}</span>
            </div>
          </div>
          <div className="center">
            <p style={{ font: '800 2.4rem var(--font-head)', color: 'var(--green)' }}>{profile.points || 0}</p>
            <p className="muted small">points</p>
          </div>
        </div>

        {editing ? (
          <form className="form" onSubmit={save} style={{ marginTop: '1.5rem' }}>
            <div className="field">
              <label htmlFor="pname">Name</label>
              <input id="pname" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows={3}
                maxLength={300}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Favourite motion, debating style, school..."
              />
            </div>
            {error && <p className="notice notice-error">{error}</p>}
            <div className="row">
              <button className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            {profile.bio && <p style={{ marginTop: '1.25rem' }}>{profile.bio}</p>}
            <div className="row" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-sm" onClick={startEdit}>
                Edit profile
              </button>
              <button className="btn btn-sm btn-ghost" onClick={logout}>
                Log out
              </button>
            </div>
          </>
        )}
        <p className="muted small" style={{ marginTop: '1rem' }}>
          Signed in as {user.email}
        </p>
      </div>

      {!isMember && (
        <div className="notice" style={{ marginTop: '1.5rem' }}>
          You are not a club member yet. <Link to="/join">Apply to join</Link> to register for events and earn points.
        </div>
      )}

      <h2 className="section-title" style={{ marginTop: '3rem', textAlign: 'left' }}>
        Points history
      </h2>
      {history.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {history.map((p) => (
                <tr key={p.id}>
                  <td>{formatDate(p.createdAt, false)}</td>
                  <td>{p.reason}</td>
                  <td style={{ color: p.amount < 0 ? 'var(--danger)' : 'var(--green)' }}>
                    {p.amount > 0 ? '+' : ''}
                    {p.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">No points yet. Attend events and debate to earn them!</p>
      )}
    </div>
  )
}

export default Profile
