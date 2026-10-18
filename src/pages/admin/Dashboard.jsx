import React, { useState } from 'react'
import Applications from './Applications'
import EventsAdmin from './EventsAdmin'
import MotionsAdmin from './MotionsAdmin'
import PointsAdmin from './PointsAdmin'
import Members from './Members'

const TABS = {
  applications: { label: 'Applications', Component: Applications },
  events: { label: 'Events', Component: EventsAdmin },
  motions: { label: 'Motions', Component: MotionsAdmin },
  points: { label: 'Points', Component: PointsAdmin },
  members: { label: 'Members', Component: Members },
}

function Dashboard() {
  const [tab, setTab] = useState('applications')
  const { Component } = TABS[tab]

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Admin</h1>
        <p>Manage applications, events, attendance, motions and points.</p>
      </div>
      <div className="tabs">
        {Object.entries(TABS).map(([key, t]) => (
          <button key={key} className={tab === key ? 'tab active' : 'tab'} onClick={() => setTab(key)}>
            {t.label}
          </button>
        ))}
      </div>
      <Component />
    </div>
  )
}

export default Dashboard
