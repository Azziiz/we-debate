let ctx = null

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Call from a click handler so mobile browsers allow sound later on.
export function unlockAudio() {
  audio()
}

// Rings a bell-like tone `times` times.
export function ring(times = 1) {
  const ac = audio()
  for (let i = 0; i < times; i++) {
    const start = ac.currentTime + i * 0.35
    ;[880, 1320].forEach((freq, k) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(k === 0 ? 0.5 : 0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9)
      osc.connect(gain).connect(ac.destination)
      osc.start(start)
      osc.stop(start + 1)
    })
  }
}
