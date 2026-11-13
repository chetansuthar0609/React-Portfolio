import { useEffect, useRef } from 'react'
import { skillGroups, sphereWords } from '../data/content'
import { useReducedMotion } from '../hooks'
import { Reveal, SectionHeading, TiltCard } from './Motion'

/**
 * Lightweight 3D word sphere rendered with DOM + CSS transforms.
 * Words sit on a Fibonacci sphere; drag/hover steers the spin.
 */
function TagSphere({ words }) {
  const wrap = useRef(null)
  const itemRefs = useRef([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const n = words.length
    const pts = words.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n)
      const theta = Math.sqrt(n * Math.PI) * phi
      return { x: Math.cos(theta) * Math.sin(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(phi) }
    })

    let radius = el.clientWidth * 0.4
    let vx = 0.0035 // rotation speed around Y
    let vy = 0.0018 // rotation speed around X
    let target = { vx, vy }
    let visible = true
    let raf

    const render = () => {
      const cy = Math.cos(vx), sy = Math.sin(vx)
      const cx = Math.cos(vy), sx = Math.sin(vy)
      pts.forEach((p, i) => {
        // rotate around Y
        const x1 = p.x * cy - p.z * sy
        const z1 = p.x * sy + p.z * cy
        // rotate around X
        const y2 = p.y * cx - z1 * sx
        const z2 = p.y * sx + z1 * cx
        p.x = x1
        p.y = y2
        p.z = z2
        const node = itemRefs.current[i]
        if (!node) return
        const scale = (z2 + 2) / 3 // 0.33 .. 1
        node.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`
        node.style.opacity = String(0.25 + scale * 0.75)
        node.style.zIndex = String(Math.round(scale * 100))
        node.style.filter = z2 < -0.3 ? 'blur(1px)' : 'none'
      })
    }

    const loop = () => {
      vx += (target.vx - vx) * 0.05
      vy += (target.vy - vy) * 0.05
      render()
      if (visible) raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      target = { vx: dx * 0.03, vy: -dy * 0.03 }
    }
    const onLeave = () => (target = { vx: 0.0035, vy: 0.0018 })
    const onResize = () => (radius = el.clientWidth * 0.4)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) raf = requestAnimationFrame(loop)
    })
    io.observe(el)

    if (reduced) {
      vx = 0.4
      vy = 0.3
      render()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      removeEventListener('resize', onResize)
    }
  }, [words, reduced])

  return (
    <div className="sphere" ref={wrap} data-cursor>
      <div className="sphere-core" aria-hidden="true" />
      <ul aria-label="Technologies">
        {words.map((w, i) => (
          <li key={w} ref={(n) => (itemRefs.current[i] = n)} className={i % 4 === 0 ? 'is-accent' : i % 5 === 0 ? 'is-violet' : ''}>
            {w}
          </li>
        ))}
      </ul>
    </div>
  )
}

const groupIcons = {
  frontend: '◐',
  backend: '⌘',
  data: '◈',
  ai: '✦',
  tools: '⚙',
}

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="skills-head">
          <SectionHeading index="02" eyebrow="Skills & stack" title="A full-stack toolkit," accent="end to end." />
          <Reveal as="p" className="muted skills-intro" delay={0.1}>
            Hover or drag across the sphere to steer it. Every technology here is one I use to design, build, test and
            ship real products.
          </Reveal>
        </div>

        <div className="skills-layout">
          <Reveal className="skills-sphere-wrap" y={60}>
            <TagSphere words={sphereWords} />
          </Reveal>

          <div className="skill-cards">
            {skillGroups.map((g, i) => (
              <Reveal key={g.id} delay={i * 0.08} className={`skill-card-wrap skill-${g.id}`}>
                <TiltCard className="skill-card glass" max={8}>
                  <div className="skill-card-top">
                    <span className="skill-icon" aria-hidden="true">{groupIcons[g.id]}</span>
                    <span className="mono skill-count">{String(g.items.length).padStart(2, '0')}</span>
                  </div>
                  <h3>{g.title}</h3>
                  <p>{g.blurb}</p>
                  <ul className="chips">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
