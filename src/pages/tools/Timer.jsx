import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ring, unlockAudio } from '../../lib/bell'
import './Tools.css'

// All times in seconds. `protectedTime` is the length of the protected
// window at the start and end of the speech (0 = no POIs at all).
const PRESETS = {
  bp: { label: 'BP speech', length: 420, protectedTime: 60, grace: 15 },
  wsdc: { label: 'WSDC speech', length: 480, protectedTime: 60, grace: 15 },
  reply: { label: 'WSDC reply', length: 240, protectedTime: 0, grace: 15 },
  club: { label: 'Club speech', length: 300, protectedTime: 60, grace: 15 },
  prep: { label: 'Prep time', length: 900, protectedTime: 0, grace: 0 },
}

const fmt = (s) => {
  const sign = s < 0 ? '-' : ''
  const a = Math.abs(Math.floor(s))
  return `${sign}${Math.floor(a / 60)}:${String(a % 60).padStart(2, '0')}`
}

function getPhase(t, { length, protectedTime, grace }) {
  if (t >= length + grace && grace > 0) return { key: 'over', label: 'Overtime: stop now' }
  if (t >= length) return { key: 'grace', label: grace ? 'Time is up: finish your sentence' : 'Time is up' }
  if (!protectedTime) return { key: 'open', label: 'Speaking' }
  if (t < protectedTime) return { key: 'protected', label: 'Protected time' }
  if (t >= length - protectedTime) return { key: 'protected', label: 'Protected time: wrap up' }
  return { key: 'poi', label: 'POIs allowed' }
}

function Timer() {
  const [params] = useSearchParams()
  const [presetKey, setPresetKey] = useState(PRESETS[params.get('preset')] ? params.get('preset') : 'bp')
  const [custom, setCustom] = useState({ minutes: 5, protectedTime: 60 })
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [countDown, setCountDown] = useState(false)

  const startedAt = useRef(0)
  const base = useRef(0)
  const fired = useRef(new Set())
  const box = useRef(null)

  const preset =
    presetKey === 'custom'
      ? { label: 'Custom', length: custom.minutes * 60, protectedTime: custom.protectedTime, grace: 15 }
      : PRESETS[presetKey]

  // Bells: end of opening protected time, start of closing protected time,
  // end of speech (2), end of grace (3).
  const bells = [
    ...(preset.protectedTime ? [[preset.protectedTime, 1], [preset.length - preset.protectedTime, 1]] : []),
    [preset.length, 2],
    ...(preset.grace ? [[preset.length + preset.grace, 3]] : []),
  ]

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const t = base.current + (Date.now() - startedAt.current) / 1000
      setElapsed(t)
      bells.forEach(([at, times]) => {
        if (t >= at && !fired.current.has(at)) {
          fired.current.add(at)
          if (sound) ring(times)
        }
      })
    }, 100)
    return () => clearInterval(id)
  })

  const start = useCallback(() => {
    unlockAudio()
    startedAt.current = Date.now()
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    base.current = base.current + (Date.now() - startedAt.current) / 1000
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    base.current = 0
    fired.current = new Set()
    setElapsed(0)
    setRunning(false)
  }, [])

  useEffect(reset, [presetKey, custom.minutes, custom.protectedTime, reset])

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        running ? pause() : start()
      }
      if (e.key === 'r' || e.key === 'R') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running, start, pause, reset])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else box.current?.requestFullscreen?.()
  }

  const phase = getPhase(elapsed, preset)
  const progress = Math.min(elapsed / preset.length, 1) * 100
  const shown = countDown ? preset.length - elapsed : elapsed

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Speech timer</h1>
        <p>Space to start/pause, R to reset. Bells ring automatically at protected time and at the end.</p>
      </div>

      <div className="tabs">
        {Object.entries(PRESETS).map(([key, p]) => (
          <button key={key} className={presetKey === key ? 'tab active' : 'tab'} onClick={() => setPresetKey(key)}>
            {p.label}
          </button>
        ))}
        <button className={presetKey === 'custom' ? 'tab active' : 'tab'} onClick={() => setPresetKey('custom')}>
          Custom
        </button>
      </div>

      {presetKey === 'custom' && (
        <div className="row" style={{ marginBottom: '1.5rem' }}>
          <div className="field" style={{ width: 140 }}>
            <label htmlFor="mins">Minutes</label>
            <input
              id="mins"
              type="number"
              min="1"
              max="60"
              value={custom.minutes}
              onChange={(e) => setCustom({ ...custom, minutes: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div className="field" style={{ width: 200 }}>
            <label htmlFor="prot">Protected time</label>
            <select
              id="prot"
              value={custom.protectedTime}
              onChange={(e) => setCustom({ ...custom, protectedTime: Number(e.target.value) })}
            >
              <option value={0}>None</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>
        </div>
      )}

      <div ref={box} className={`timer-box phase-${phase.key}`}>
        <p className="timer-phase">{phase.label}</p>
        <p className="timer-clock" aria-live="off">
          {fmt(shown)}
        </p>
        <p className="muted">
          {preset.label} · {fmt(preset.length)}
        </p>
        <div className="timer-bar">
          {preset.protectedTime > 0 && (
            <>
              <span className="timer-zone" style={{ left: 0, width: `${(preset.protectedTime / preset.length) * 100}%` }} />
              <span className="timer-zone" style={{ right: 0, width: `${(preset.protectedTime / preset.length) * 100}%` }} />
            </>
          )}
          <span className="timer-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="row timer-controls">
          {running ? (
            <button className="btn btn-primary" onClick={pause}>
              <span className="material-symbols-outlined">pause</span> Pause
            </button>
          ) : (
            <button className="btn btn-primary" onClick={start}>
              <span className="material-symbols-outlined">play_arrow</span> {elapsed ? 'Resume' : 'Start'}
            </button>
          )}
          <button className="btn btn-ghost" onClick={reset}>
            <span className="material-symbols-outlined">restart_alt</span> Reset
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              unlockAudio()
              ring(1)
            }}
          >
            <span className="material-symbols-outlined">notifications</span> Bell
          </button>
          <button className="btn btn-ghost" onClick={toggleFullscreen}>
            <span className="material-symbols-outlined">fullscreen</span> Full screen
          </button>
        </div>
      </div>

      <div className="row" style={{ marginTop: '1rem' }}>
        <label className="row small">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Sound on
        </label>
        <label className="row small">
          <input type="checkbox" checked={countDown} onChange={(e) => setCountDown(e.target.checked)} /> Count down
        </label>
      </div>
    </div>
  )
}

export default Timer
