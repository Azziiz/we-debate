import React, { useState } from 'react'
import { collection, deleteDoc, doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useCollection } from '../../lib/useCollection'
import { SEED_MOTIONS } from '../../data/motions'
import { Loading } from '../../components/Guards'

function MotionsAdmin() {
  const { user } = useAuth()
  const { docs, loading } = useCollection(() => collection(db, 'motions'), [])
  const [busy, setBusy] = useState(false)

  const pending = docs.filter((m) => !m.approved)
  const approved = docs.filter((m) => m.approved).sort((a, b) => a.topic.localeCompare(b.topic))

  const importSeed = async () => {
    setBusy(true)
    const batch = writeBatch(db)
    SEED_MOTIONS.forEach(({ id, ...m }) => {
      batch.set(doc(collection(db, 'motions')), { ...m, createdBy: user.uid, createdAt: serverTimestamp() })
    })
    await batch.commit()
    setBusy(false)
  }

  const remove = async (m) => {
    if (window.confirm('Delete this motion?')) await deleteDoc(doc(db, 'motions', m.id))
  }

  if (loading) return <Loading />

  return (
    <div className="stack">
      {!docs.length && (
        <div className="notice">
          The library is using the {SEED_MOTIONS.length} built-in starter motions. Import them to edit them or add your
          own.{' '}
          <button className="btn btn-sm" onClick={importSeed} disabled={busy}>
            Import starter motions
          </button>
        </div>
      )}
      <p className="muted small">New motions can be added from the Library page.</p>

      <h3>Suggestions to review ({pending.length})</h3>
      {pending.length ? (
        pending.map((m) => (
          <div className="card spread" key={m.id}>
            <div>
              <p style={{ fontWeight: 600 }}>{m.text}</p>
              <p className="muted small">
                {m.topic} · {m.difficulty}
                {m.infoSlide && ` · Info: ${m.infoSlide}`}
              </p>
            </div>
            <div className="row">
              <button className="btn btn-sm btn-primary" onClick={() => updateDoc(doc(db, 'motions', m.id), { approved: true })}>
                Approve
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => remove(m)}>
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="muted">Nothing to review.</p>
      )}

      <h3 style={{ marginTop: '1.5rem' }}>Library ({approved.length})</h3>
      <div className="table-wrap">
        <table>
          <tbody>
            {approved.map((m) => (
              <tr key={m.id}>
                <td>{m.text}</td>
                <td className="muted small">{m.topic}</td>
                <td className="muted small">{m.difficulty}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(m)} aria-label="Delete motion">
                    <span className="material-symbols-outlined">delete</span>
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

export default MotionsAdmin
