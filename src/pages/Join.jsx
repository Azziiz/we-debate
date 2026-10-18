import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, firebaseReady } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { SOCIALS } from '../data/club'
import { Loading } from '../components/Guards'

const SOURCES = ['Social media', 'A friend', 'An event', 'School', 'Other']

function ApplicationForm({ user, profile }) {
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: '',
    age: '',
    why: '',
    source: '',
  })
  const [status, setStatus] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await setDoc(doc(db, 'applications', user.uid), {
        ...form,
        age: Number(form.age),
        email: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="name">Full name *</label>
        <input id="name" required value={form.name} onChange={set('name')} />
      </div>
      <div className="row">
        <div className="field" style={{ flex: 1, minWidth: 140 }}>
          <label htmlFor="age">Age *</label>
          <input id="age" type="number" min="10" max="99" required value={form.age} onChange={set('age')} />
        </div>
        <div className="field" style={{ flex: 2, minWidth: 180 }}>
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" type="tel" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="why">Why do you want to join us? *</label>
        <textarea id="why" required rows={5} value={form.why} onChange={set('why')} />
      </div>
      <div className="field">
        <label htmlFor="source">How did you hear about us?</label>
        <select id="source" value={form.source} onChange={set('source')}>
          <option value="">Choose (optional)</option>
          {SOURCES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <p className="muted small">We will contact you at {user.email}.</p>
      <button className="btn btn-primary" disabled={status === 'saving'}>
        Send application
      </button>
      {status === 'error' && <p className="notice notice-error">Could not send. Please try again.</p>}
    </form>
  )
}

function Join() {
  const { user, profile, loading, isMember } = useAuth()
  const [application, setApplication] = useState(undefined)

  useEffect(() => {
    if (!user) return
    return onSnapshot(
      doc(db, 'applications', user.uid),
      (snap) => setApplication(snap.exists() ? snap.data() : null),
      () => setApplication(null)
    )
  }, [user])

  let content
  if (!firebaseReady) {
    content = (
      <div className="card center">
        <p>
          Send us a message on{' '}
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>{' '}
          to join the club.
        </p>
      </div>
    )
  } else if (loading || (user && application === undefined)) {
    content = <Loading />
  } else if (!user) {
    content = (
      <div className="card center stack">
        <p>Create an account first so we can keep track of your application and, once accepted, your events and points.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/login" state={{ from: '/join' }} className="btn btn-primary">
            Sign in / create account
          </Link>
        </div>
      </div>
    )
  } else if (isMember) {
    content = (
      <div className="notice notice-success">
        You are already a member. Welcome! Check the <Link to="/events">upcoming events</Link>.
      </div>
    )
  } else if (application?.status === 'pending') {
    content = (
      <div className="card center stack">
        <h3 style={{ color: 'var(--green)' }}>Your application has been sent</h3>
        <p className="muted">
          Thank you for your interest in joining our English Debating Club! We will review your request and get back to
          you soon. We value commitment and teamwork and look forward to having you on board!
        </p>
      </div>
    )
  } else if (application?.status === 'rejected') {
    content = (
      <div className="notice">
        Your application was not accepted this time. Feel free to reach out on{' '}
        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        .
      </div>
    )
  } else {
    content = <ApplicationForm user={user} profile={profile} />
  }

  return (
    <div className="container page" style={{ maxWidth: 640 }}>
      <div className="page-head">
        <h1>Join us</h1>
        <p>Sharpen your arguments, build confidence and be part of The Circle.</p>
      </div>
      {content}
    </div>
  )
}

export default Join
