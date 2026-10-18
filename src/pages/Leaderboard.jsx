import React from 'react'
import { Link } from 'react-router-dom'
import { collection, limit, orderBy, query } from 'firebase/firestore'
import { db, firebaseReady } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../lib/useCollection'
import Avatar from '../components/Avatar'
import FirebaseNotice from '../components/FirebaseNotice'
import { Loading } from '../components/Guards'

const MEDALS = ['🥇', '🥈', '🥉']

function Board() {
  const { user } = useAuth()
  const { docs, loading } = useCollection(
    () => query(collection(db, 'users'), orderBy('points', 'desc'), limit(100)),
    []
  )
  const members = docs.filter((u) => u.role !== 'guest')

  if (loading) return <Loading />
  if (!members.length) return <p className="muted center">No members yet.</p>

  return (
    <div className="stack">
      {members.map((m, i) => (
        <div
          className="card spread"
          key={m.id}
          style={m.id === user.uid ? { borderColor: 'var(--green)' } : undefined}
        >
          <div className="row">
            <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>{MEDALS[i] || i + 1}</span>
            <Avatar name={m.name} src={m.photoURL} />
            <div>
              <strong>{m.name}</strong>
              {m.bio && <p className="muted small">{m.bio.slice(0, 60)}</p>}
            </div>
          </div>
          <strong style={{ color: 'var(--green)', fontSize: '1.2rem' }}>{m.points || 0}</strong>
        </div>
      ))}
    </div>
  )
}

function Leaderboard() {
  const { user, loading } = useAuth()

  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <h1>Leaderboard</h1>
        <p>Points are earned by attending events, winning debates and being named best speaker.</p>
      </div>
      {!firebaseReady ? (
        <FirebaseNotice />
      ) : loading ? (
        <Loading />
      ) : !user ? (
        <div className="card center">
          <p>
            <Link to="/login" state={{ from: '/leaderboard' }}>
              Log in
            </Link>{' '}
            to see the leaderboard.
          </p>
        </div>
      ) : (
        <Board />
      )}
    </div>
  )
}

export default Leaderboard
