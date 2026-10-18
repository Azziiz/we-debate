import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="card card-link event-card">
      {event.image && <img src={event.image} alt="" className="event-card-img" />}
      <div className="row" style={{ marginBottom: '0.5rem' }}>
        <span className={event.type === 'The Circle' ? 'tag tag-orange' : 'tag'}>{event.type}</span>
      </div>
      <h3>{event.title}</h3>
      <p className="muted small">
        <span className="material-symbols-outlined">calendar_month</span> {formatDate(event.date)}
      </p>
      {event.location && (
        <p className="muted small">
          <span className="material-symbols-outlined">location_on</span> {event.location}
        </p>
      )}
    </Link>
  )
}

export default EventCard
