import React, { useState } from 'react'
import { firebaseReady } from '../firebase'
import { useCollection } from '../lib/useCollection'
import { upcomingEventsQuery, pastEventsQuery } from '../lib/events'
import { SOCIALS } from '../data/club'
import EventCard from '../components/EventCard'
import { Loading } from '../components/Guards'
import './Home.css'

function Events() {
  const [tab, setTab] = useState('upcoming')
  const upcoming = useCollection(() => upcomingEventsQuery(), [])
  const past = useCollection(() => pastEventsQuery(), [])
  const current = tab === 'upcoming' ? upcoming : past

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Events</h1>
        <p>The Circle, Arena, weekly sessions, Walk & Talk and more.</p>
      </div>

      {!firebaseReady ? (
        <div className="card center">
          <p>
            Follow us on{' '}
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>{' '}
            for our next events.
          </p>
        </div>
      ) : (
        <>
          <div className="tabs">
            <button className={tab === 'upcoming' ? 'tab active' : 'tab'} onClick={() => setTab('upcoming')}>
              Upcoming
            </button>
            <button className={tab === 'past' ? 'tab active' : 'tab'} onClick={() => setTab('past')}>
              Past
            </button>
          </div>
          {current.loading ? (
            <Loading />
          ) : current.docs.length ? (
            <div className="grid">
              {current.docs.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <p className="muted center">
              {tab === 'upcoming' ? 'No upcoming events yet. Stay tuned!' : 'No past events yet.'}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Events
