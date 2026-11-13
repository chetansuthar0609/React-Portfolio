import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks'

/**
 * Fixed, full-page living background:
 *  - drifting aurora gradients (pure CSS, transform-only)
 *  - a 2D-canvas particle constellation that links nearby points and reaches toward the cursor
 * Pauses when the tab is hidden; renders a single static frame for reduced-motion users.
 */
export default function Background() {
  const canvas = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const c = canvas.current
    const ctx = c.getContext('2d')
    let w = 0, h = 0, dpr = 1, raf
    let particles = []
    const mouse = { x: -9999, y: -9999 }
    const colors = ['77,163,255', '139,92,255', '62,240,255']

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = w + 'px'
      c.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
        c: colors[(Math.random() * colors.length) | 0],
      }))
    }

    const LINK = 130
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        // gentle pull toward cursor
        const mdx = mouse.x - p.x
        const mdy = mouse.y - p.y
        const md = Math.hypot(mdx, mdy)
        if (md < 180) {
          p.x += mdx * 0.004
          p.y += mdy * 0.004
          ctx.strokeStyle = `rgba(${p.c},${(1 - md / 180) * 0.45})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.16
            ctx.strokeStyle = `rgba(${p.c},${a})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        ctx.fillStyle = `rgba(${p.c},0.85)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (reduced) draw()
      else raf = requestAnimationFrame(loop)
    }
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start())
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }

    resize()
    start()
    addEventListener('resize', resize)
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  return (
    <div className="bg" aria-hidden="true">
      <div className="aurora">
        <span className="aurora-a" />
        <span className="aurora-b" />
        <span className="aurora-c" />
      </div>
      <canvas ref={canvas} className="bg-particles" />
      <div className="bg-vignette" />
    </div>
  )
}

/** Feeds cursor position into any `.glass` card as CSS vars for the spotlight + border glow. */
export function useGlassSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const el = e.target.closest?.('.glass')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    addEventListener('pointermove', onMove, { passive: true })
    return () => removeEventListener('pointermove', onMove)
  }, [])
}
