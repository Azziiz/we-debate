import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, firebaseReady } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../lib/useCollection'
import { formatDate, toDate } from '../lib/format'
import { Loading } from '../components/Guards'
import FirebaseNotice from '../components/FirebaseNotice'
import './Home.css'

function Registration({ event }) {
  const { user, profile, isMember } = useAuth()
  const { docs: regs } = useCollection(
    () => (isMember ? collection(db, 'events', event.id, 'registrations') : null),
    [event.id, isMember]
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isPast = toDate(event.date) < new Date()
  const registered = regs.some((r) => r.id === user?.uid)
  const full = event.capacity > 0 && regs.length >= event.capacity

  if (isPast) return null

  if (event.formUrl && !isMember) {
    return (
      <a href={event.formUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Fill the form
      </a>
    )
  }

  if (!user) {
    return (
      <Link to="/login" state={{ from: `/events/${event.id}` }} className="btn btn-primary">
        Log in to register
      </Link>
    )
  }

  if (!isMember) {
    return (
      <p className="notice">
        Registration is for club members. <Link to="/join">Apply to join</Link>
        {event.formUrl && (
          <>
            {' '}or{' '}
            <a href={event.formUrl} target="_blank" rel="noopener noreferrer">
              fill the event form
            </a>
          </>
        )}
        .
      </p>
    )
  }

  const toggle = async () => {
    setBusy(true)
    setError('')
    const ref = doc(db, 'events', event.id, 'registrations', user.uid)
    try {
      if (registered) await deleteDoc(ref)
      else await setDoc(ref, { name: profile.name, attended: false, createdAt: serverTimestamp() })
    } catch (e) {
      console.error(e)
      setError('Something went wrong. Please try again.')
    }
    setBusy(false)
  }

  return (
    <div className="stack">
      <p className="muted small">
        {regs.length} registered{event.capacity > 0 ? ` · ${Math.max(event.capacity - regs.length, 0)} spots left` : ''}
      </p>
      <div className="row">
        {registered ? (
          <>
            <span className="tag">You are registered</span>
            <button className="btn btn-ghost btn-sm" onClick={toggle} disabled={busy}>
              Cancel registration
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={toggle} disabled={busy || full}>
            {full ? 'Event full' : 'Register'}
          </button>
        )}
      </div>
      {error && <p className="notice notice-error">{error}</p>}
    </div>
  )
}

function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(undefined)

  useEffect(() => {
    if (!firebaseReady) return
    return onSnapshot(
      doc(db, 'events', id),
      (snap) => setEvent(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      () => setEvent(null)
    )
  }, [id])

  if (!firebaseReady)
    return (
      <div className="container page">
        <FirebaseNotice />
      </div>
    )
  if (event === undefined) return <Loading />
  if (event === null)
    return (
      <div className="container page center">
        <h1>Event not found</h1>
        <Link to="/events">Back to events</Link>
      </div>
    )

  return (
    <div className="container page" style={{ maxWidth: 800 }}>
      <Link to="/events" className="small">
        <span className="material-symbols-outlined">arrow_back</span> All events
      </Link>
      {event.image && (
        <img src={event.image} alt="" style={{ width: '100%', borderRadius: 12, margin: '1.5rem 0', aspectRatio: '16/9', objectFit: 'cover' }} />
      )}
      <div className="page-head" style={{ marginTop: '1rem' }}>
        <span className={event.type === 'The Circle' ? 'tag tag-orange' : 'tag'}>{event.type}</span>
        <h1 style={{ marginTop: '0.75rem' }}>{event.title}</h1>
        <p>
          <span className="material-symbols-outlined">calendar_month</span> {formatDate(event.date)}
          {event.location && (
            <>
              <br />
              <span className="material-symbols-outlined">location_on</span> {event.location}
            </>
          )}
        </p>
      </div>
      {event.description && <p style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{event.description}</p>}
      <Registration event={event} />
    </div>
  )
}

export default EventDetail
