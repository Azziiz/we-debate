import React, { useState } from 'react'
import { collection, doc, query, where, writeBatch, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollection } from '../../lib/useCollection'
import { formatDate } from '../../lib/format'
import { Loading } from '../../components/Guards'

function Applications() {
  const [status, setStatus] = useState('pending')
  const { docs, loading } = useCollection(
    () => query(collection(db, 'applications'), where('status', '==', status)),
    [status]
  )
  const [error, setError] = useState('')

  const approve = async (app) => {
    setError('')
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, 'applications', app.id), { status: 'approved' })
      batch.update(doc(db, 'users', app.id), { role: 'member', name: app.name })
      await batch.commit()
    } catch (e) {
      console.error(e)
      setError('Could not approve. The user profile may be missing.')
    }
  }

  const reject = async (app) => {
    if (!window.confirm(`Reject ${app.name}'s application?`)) return
    await updateDoc(doc(db, 'applications', app.id), { status: 'rejected' })
  }

  return (
    <div className="stack">
      <div className="row">
        {['pending', 'approved', 'rejected'].map((s) => (
          <button key={s} className={status === s ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'} onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>
      {error && <p className="notice notice-error">{error}</p>}
      {loading ? (
        <Loading />
      ) : !docs.length ? (
        <p className="muted">No {status} applications.</p>
      ) : (
        docs.map((a) => (
          <div className="card" key={a.id}>
            <div className="spread">
              <h3>{a.name}</h3>
              <span className="muted small">{formatDate(a.createdAt)}</span>
            </div>
            <p className="small muted">
              <a href={`mailto:${a.email}`}>{a.email}</a>
              {a.phone && ` · ${a.phone}`} · {a.age} years old{a.source && ` · heard via ${a.source}`}
            </p>
            <p style={{ marginTop: '0.75rem', whiteSpace: 'pre-line' }}>{a.why}</p>
            {status === 'pending' && (
              <div className="row" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => approve(a)}>
                  Approve
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => reject(a)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default Applications
