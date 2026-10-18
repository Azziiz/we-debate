import React from 'react'
import { collection, doc, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useCollection } from '../../lib/useCollection'
import { formatDate } from '../../lib/format'
import Avatar from '../../components/Avatar'

function Members() {
  const { user } = useAuth()
  const { docs: users } = useCollection(() => query(collection(db, 'users'), orderBy('name')), [])

  const setRole = async (u, role) => {
    if (role === 'admin' && !window.confirm(`Make ${u.name} an admin? Admins can manage everything.`)) return
    await updateDoc(doc(db, 'users', u.id), { role })
  }

  const counts = users.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {})

  return (
    <div className="stack">
      <p className="muted small">
        {counts.admin || 0} admins · {counts.member || 0} members · {counts.guest || 0} guests (signed up, not approved)
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Joined</th>
              <th>Points</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="row">
                    <Avatar name={u.name} src={u.photoURL} size={32} />
                    {u.name}
                  </div>
                </td>
                <td className="muted">{formatDate(u.createdAt, false)}</td>
                <td>{u.points || 0}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={u.id === user.uid}
                    onChange={(e) => setRole(u, e.target.value)}
                    style={{ width: 'auto' }}
                    aria-label={`${u.name} role`}
                  >
                    <option value="guest">Guest</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Members
