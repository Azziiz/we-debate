import React, { useState } from 'react'
import { GALLERY, SOCIALS } from '../data/club'

function Gallery() {
  const [open, setOpen] = useState(null)

  return (
    <div className="container page">
      <div className="page-head spread">
        <div>
          <h1>Gallery</h1>
          <p>Moments from our sessions and events.</p>
        </div>
        <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="btn">
          More on Instagram
        </a>
      </div>
      <div className="grid">
        {GALLERY.map((g) => (
          <button key={g.src} className="gallery-item" onClick={() => setOpen(g)}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            <span>{g.caption}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <img src={open.src} alt={open.caption} />
          <p>{open.caption}</p>
        </div>
      )}
    </div>
  )
}

export default Gallery
