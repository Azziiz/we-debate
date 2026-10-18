import React, { useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useCollection } from '../../lib/useCollection'
import { formatDate, toInputValue } from '../../lib/format'
import { awardPoints, revokePoints } from '../../lib/points'
import { EVENT_TYPES, POINT_PRESETS } from '../../data/club'
import { Loading } from '../../components/Guards'

const ATTENDANCE_POINTS = POINT_PRESETS.find((p) => p.label === 'Attendance').value
const EMPTY = { title: '', type: EVENT_TYPES[0], date: '', location: '', description: '', capacity: 0, image: '', formUrl: '' }

function EventForm({ initial, onDone }) {
  const [form, setForm] = useState(
    initial ? { ...EMPTY, ...initial, date: toInputValue(initial.date) } : EMPTY
  )
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const data = {
      title: form.title.trim(),
      type: form.type,
      date: Timestamp.fromDate(new Date(form.date)),
      location: form.location.trim(),
      description: form.description.trim(),
      capacity: Number(form.capacity) || 0,
      image: form.image.trim(),
      formUrl: form.formUrl.trim(),
    }
    try {
      if (initial) await updateDoc(doc(db, 'events', initial.id), data)
      else await addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp() })
      onDone()
    } catch (err) {
      console.error(err)
      alert('Could not save the event.')
      setBusy(false)
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>{initial ? 'Edit event' : 'New event'}</h3>
      <div className="field">
        <label htmlFor="ev-title">Title *</label>
        <input id="ev-title" required value={form.title} onChange={set('title')} placeholder="The Circle 2027" />
      </div>
      <div className="row">
        <div className="field" style={{ flex: 1, minWidth: 160 }}>
          <label htmlFor="ev-type">Type</label>
          <select id="ev-type" value={form.type} onChange={set('type')}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ flex: 1, minWidth: 200 }}>
          <label htmlFor="ev-date">Date & time *</label>
          <input id="ev-date" type="datetime-local" required value={form.date} onChange={set('date')} />
        </div>
        <div className="field" style={{ width: 120 }}>
          <label htmlFor="ev-cap">Capacity</label>
          <input id="ev-cap" type="number" min="0" value={form.capacity} onChange={set('capacity')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ev-loc">Location</label>
        <input id="ev-loc" value={form.location} onChange={set('location')} />
      </div>
      <div className="field">
        <label htmlFor="ev-desc">Description</label>
        <textarea id="ev-desc" rows={4} value={form.description} onChange={set('description')} />
      </div>
      <div className="field">
        <label htmlFor="ev-img">Image URL (optional)</label>
        <input id="ev-img" value={form.image} onChange={set('image')} placeholder="/assets/circle.jpg or https://..." />
      </div>
      <div className="field">
        <label htmlFor="ev-form">External sign-up form for non-members (optional)</label>
        <input id="ev-form" type="url" value={form.formUrl} onChange={set('formUrl')} placeholder="https://forms.gle/..." />
      </div>
      <p className="muted small">Capacity 0 means unlimited.</p>
      <div className="row">
        <button className="btn btn-primary" disabled={busy}>
          Save
        </button>
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Attendance({ event }) {
  const { user } = useAuth()
  const { docs: regs, loading } = useCollection(() => collection(db, 'events', event.id, 'registrations'), [event.id])

  const toggle = async (reg) => {
    const batch = writeBatch(db)
    const pointsId = `att_${event.id}_${reg.id}`
    batch.update(doc(db, 'events', event.id, 'registrations', reg.id), { attended: !reg.attended })
    if (reg.attended) {
      await revokePoints({ id: pointsId, uid: reg.id, amount: ATTENDANCE_POINTS, batch })
    } else {
      await awardPoints({
        id: pointsId,
        uid: reg.id,
        name: reg.name,
        amount: ATTENDANCE_POINTS,
        reason: `Attended ${event.title}`,
        awardedBy: user.uid,
        batch,
      })
    }
    try {
      await batch.commit()
    } catch (e) {
      console.error(e)
      alert('Could not update attendance.')
    }
  }

  if (loading) return <Loading />
  if (!regs.length) return <p className="muted small">No registrations yet.</p>

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Registered</th>
            <th>Attended (+{ATTENDANCE_POINTS} pts)</th>
          </tr>
        </thead>
        <tbody>
          {regs.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td className="muted">{formatDate(r.createdAt)}</td>
              <td>
                <input type="checkbox" checked={!!r.attended} onChange={() => toggle(r)} aria-label={`${r.name} attended`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EventsAdmin() {
  const { docs: events, loading } = useCollection(() => query(collection(db, 'events'), orderBy('date', 'desc')), [])
  const [editing, setEditing] = useState(null) // null | 'new' | event
  const [openId, setOpenId] = useState(null)

  const remove = async (ev) => {
    if (!window.confirm(`Delete "${ev.title}"? Registrations will no longer be visible.`)) return
    await deleteDoc(doc(db, 'events', ev.id))
  }

  if (editing) return <EventForm initial={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />

  return (
    <div className="stack">
      <div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          <span className="material-symbols-outlined">add</span> New event
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        events.map((ev) => (
          <div className="card" key={ev.id}>
            <div className="spread">
              <div>
                <span className="tag">{ev.type}</span>
                <h3 style={{ marginTop: '0.4rem' }}>{ev.title}</h3>
                <p className="muted small">{formatDate(ev.date)}</p>
              </div>
              <div className="row">
                <button className="btn btn-sm btn-ghost" onClick={() => setOpenId(openId === ev.id ? null : ev.id)}>
                  Attendance
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setEditing(ev)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(ev)}>
                  Delete
                </button>
              </div>
            </div>
            {openId === ev.id && (
              <div style={{ marginTop: '1rem' }}>
                <Attendance event={ev} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default EventsAdmin
