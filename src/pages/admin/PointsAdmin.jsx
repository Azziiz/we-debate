import React, { useState } from 'react'
import { collection, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useCollection } from '../../lib/useCollection'
import { awardPoints, revokePoints } from '../../lib/points'
import { formatDate } from '../../lib/format'
import { POINT_PRESETS } from '../../data/club'

function PointsAdmin() {
  const { user } = useAuth()
  const { docs: users } = useCollection(() => query(collection(db, 'users'), orderBy('name')), [])
  const { docs: recent } = useCollection(
    () => query(collection(db, 'points'), orderBy('createdAt', 'desc'), limit(30)),
    []
  )
  const members = users.filter((u) => u.role !== 'guest')

  const [form, setForm] = useState({ uid: '', amount: POINT_PRESETS[0].value, reason: POINT_PRESETS[0].label })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    const member = members.find((m) => m.id === form.uid)
    setStatus('saving')
    try {
      await awardPoints({
        uid: member.id,
        name: member.name,
        amount: Number(form.amount),
        reason: form.reason.trim(),
        awardedBy: user.uid,
      })
      setStatus('saved')
      setForm({ ...form, uid: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const undo = async (p) => {
    if (window.confirm(`Remove ${p.amount} points from ${p.name}?`)) {
      await revokePoints({ id: p.id, uid: p.uid, amount: p.amount })
    }
  }

  return (
    <div className="stack">
      <form className="card form" onSubmit={submit}>
        <h3>Award points</h3>
        <div className="row">
          {POINT_PRESETS.map((p) => (
            <button
              type="button"
              key={p.label}
              className={form.reason === p.label ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'}
              onClick={() => setForm({ ...form, reason: p.label, amount: p.value })}
            >
              {p.label} (+{p.value})
            </button>
          ))}
        </div>
        <div className="row">
          <select
            required
            value={form.uid}
            onChange={(e) => setForm({ ...form, uid: e.target.value })}
            style={{ flex: 2, minWidth: 180 }}
            aria-label="Member"
          >
            <option value="">Choose a member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.points || 0})
              </option>
            ))}
          </select>
          <input
            type="number"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={{ width: 100 }}
            aria-label="Points"
          />
          <input
            required
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Reason"
            style={{ flex: 3, minWidth: 180 }}
            aria-label="Reason"
          />
        </div>
        <div className="row">
          <button className="btn btn-primary" disabled={status === 'saving'}>
            Award
          </button>
          {status === 'saved' && <span className="small" style={{ color: 'var(--green)' }}>Points awarded.</span>}
          {status === 'error' && <span className="small" style={{ color: 'var(--danger)' }}>Could not save.</span>}
        </div>
        <p className="muted small">Use a negative number to remove points.</p>
      </form>

      <h3>Recent</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Member</th>
              <th>Reason</th>
              <th>Points</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id}>
                <td className="muted">{formatDate(p.createdAt, false)}</td>
                <td>{p.name}</td>
                <td>{p.reason}</td>
                <td>{p.amount}</td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => undo(p)}>
                    Undo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PointsAdmin
