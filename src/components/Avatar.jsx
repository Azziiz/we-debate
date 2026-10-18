import React from 'react'

function Avatar({ name = '', src, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 }
  if (src) return <img className="avatar" src={src} alt={name} style={style} referrerPolicy="no-referrer" />
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span className="avatar" style={style} aria-label={name}>
      {initials || '?'}
    </span>
  )
}

export default Avatar
