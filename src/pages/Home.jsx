import React from 'react'
import { Link } from 'react-router-dom'
import { BENEFITS, ACHIEVEMENTS, ACTIVITIES, SOCIALS } from '../data/club'
import { firebaseReady } from '../firebase'
import { useCollection } from '../lib/useCollection'
import { upcomingEventsQuery } from '../lib/events'
import { formatDate } from '../lib/format'
import EventCard from '../components/EventCard'
import './Home.css'

const TOOLS = [
  { to: '/tools/timer', icon: 'timer', title: 'Speech timer' },
  { to: '/tools/motion', icon: 'casino', title: 'Motion generator' },
  { to: '/tools/draw', icon: 'groups', title: 'Team draw' },
  { to: '/tools/score', icon: 'scoreboard', title: 'Score sheet' },
]

function Hero({ next }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <p className="hero-kicker">We Debate Club · Djerba</p>
        {next ? (
          <>
            <h1>
              {next.title} is <span className="hero-brush">coming!</span>
            </h1>
            <p className="hero-sub">
              {formatDate(next.date)}
              {next.location ? ` · ${next.location}` : ''}
            </p>
            <div className="row hero-actions">
              <Link to={`/events/${next.id}`} className="btn btn-primary">
                Secure your spot
              </Link>
              <Link to="/events" className="btn btn-ghost">
                All events
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>
              For the thinkers, the challengers, the <span className="hero-brush">loud minds.</span>
            </h1>
            <p className="hero-sub">
              An English debating club where you sharpen your arguments, build confidence and meet people who love a
              good clash of ideas.
            </p>
            <div className="row hero-actions">
              <Link to="/join" className="btn btn-primary">
                Join the club
              </Link>
              <Link to="/tools" className="btn btn-ghost">
                Try the debate tools
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Home() {
  const { docs: upcoming } = useCollection(() => upcomingEventsQuery(3), [])

  return (
    <>
      <Hero next={upcoming[0]} />

      {firebaseReady && upcoming.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Upcoming events</h2>
          <div className="grid">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      <section className="section container" id="why">
        <h2 className="section-title">Why join us?</h2>
        <div className="split">
          <ul className="bullets">
            {BENEFITS.map((b) => (
              <li key={b.text}>
                <img src={b.icon} alt="" />
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
          <img src="/assets/pic.jpg" alt="Club members debating" className="split-img" />
        </div>
      </section>

      <section className="section container" id="activities">
        <h2 className="section-title">Activities</h2>
        <div className="activities">
          {ACTIVITIES.map((a) => (
            <div className="card activity" key={a.title}>
              <img src={a.icon} alt="" />
              <h3>{a.title}</h3>
              <p className="muted small">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container" id="achievements">
        <h2 className="section-title">Achievements</h2>
        <div className="split split-reverse">
          <ul className="bullets">
            {ACHIEVEMENTS.map((a) => (
              <li key={a.text}>
                <img src={a.icon} alt="" />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
          <img src="/assets/circle.jpg" alt="The Circle event" className="split-img" />
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Debate tools</h2>
        <div className="tool-strip">
          {TOOLS.map((t) => (
            <Link to={t.to} className="card card-link tool-tile" key={t.to}>
              <span className="material-symbols-outlined">{t.icon}</span>
              <span>{t.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="card cta">
          <h2>
            Ready to make your <span className="highlight">voice</span> heard?
          </h2>
          <p className="muted">Send your application and we will get back to you.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/join" className="btn btn-orange">
              Join us
            </Link>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
