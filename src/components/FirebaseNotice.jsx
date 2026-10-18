import React from 'react'

function FirebaseNotice() {
  return (
    <div className="notice notice-warning">
      Member features (accounts, events sign-up, leaderboard) are not set up yet. Add the Firebase keys to{' '}
      <code>.env.local</code> (see <code>README.md</code>).
    </div>
  )
}

export default FirebaseNotice
