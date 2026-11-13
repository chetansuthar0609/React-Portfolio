import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { projects, profile } from '../data/content'
import { useMediaQuery, useReducedMotion } from '../hooks'
import { ArrowUpRight, GitHub, Search } from './Icons'
import { Reveal, SectionHeading, TiltCard } from './Motion'

/* ---------- Project visuals (code-drawn, no screenshots needed) ---------- */

/** Listings UI; on hover a property-detail drawer wipes in. */
function EstateVisual() {
  const homes = [
    { price: '₹1.2 Cr', meta: '3 BHK · Bodakdev', hue: 'a' },
    { price: '₹78 L', meta: '2 BHK · Prahlad Nagar', hue: 'b' },
    { price: '₹2.4 Cr', meta: '4 BHK · Thaltej', hue: 'c' },
    { price: '₹95 L', meta: '3 BHK · Satellite', hue: 'd' },
  ]
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-bar">
        <i /><i /><i />
        <span className="mock-url">estate.app/listings</span>
      </div>
      <div className="mock-body">
        <div className="mock-search">
          <Search width={14} height={14} />
          <span>Search by city, locality…</span>
          <b>Search</b>
        </div>
        <div className="mock-filters">
          <span className="on">Buy</span><span>Rent</span><span>2–4 BHK</span><span>Under ₹2 Cr</span>
        </div>
        <div className="mock-grid">
          {homes.map((h) => (
            <div key={h.meta} className="mock-card">
              <div className={`mock-img mock-img-${h.hue}`}><span className="mock-roof" /></div>
              <strong>{h.price}</strong>
              <small>{h.meta}</small>
            </div>
          ))}
        </div>
      </div>
      {/* revealed on hover: detail page */}
      <div className="mock-detail">
        <div className="mock-img mock-img-b mock-detail-img"><span className="mock-roof" /></div>
        <strong>₹78 L</strong>
        <small>2 BHK · Prahlad Nagar</small>
        <div className="mock-detail-specs">
          <span>2 Beds</span><span>2 Baths</span><span>Parking</span>
        </div>
        <b className="mock-detail-cta">Schedule visit</b>
      </div>
      <div className="mock-float mock-float-a glass"><span className="badge-dot" /> Live search</div>
      <div className="mock-float mock-float-b glass">GET /api/properties · 200</div>
    </div>
  )
}

/** A CSS 3D cube of the stack; faces separate on hover. */
function CubeVisual() {
  const faces = ['React', 'Three.js', 'Motion', 'Vite', 'WebGL', 'CSS 3D']
  return (
    <div className="cube-stage" aria-hidden="true">
      <div className="cube-orbit" />
      <div className="cube-orbit cube-orbit-2" />
      <div className="cube">
        {faces.map((f, i) => (
          <span key={f} className={`cube-face cube-face-${i}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="cube-shadow" />
    </div>
  )
}

/** Terminal issuing a request; on hover the JSON response wipes in. */
function TerminalVisual() {
  return (
    <div className="term" aria-hidden="true">
      <div className="mock-bar">
        <i /><i /><i />
        <span className="mock-url">zsh — api</span>
      </div>
      <div className="term-body mono">
        <p><span className="tk-k">$</span> curl -X POST /api/v1/listings</p>
        <p className="term-dim">→ validating payload…</p>
        <p className="term-dim">→ writing to MongoDB…</p>
        <p><span className="tk-b">201</span> Created <span className="term-dim">· 38ms</span></p>
        <pre className="term-json">
{`{
  "id": "6650f3c1…",
  "title": "3 BHK · Thaltej",
  "price": 24000000,
  "status": "published"
}`}
        </pre>
        <p className="term-cursor"><span className="tk-k">$</span> <span className="caret" /></p>
      </div>
    </div>
  )
}

const visuals = { estate: EstateVisual, portfolio: CubeVisual, api: TerminalVisual }

function ProjectPanel({ p, i, total }) {
  const Visual = visuals[p.id]
  return (
    <TiltCard className={`project-panel glass project-${p.id}`} max={5}>
      <div className="project-copy">
        <div className="project-meta">
          <span className="project-num mono">
            {String(i + 1).padStart(2, '0')} <em>/ {String(total).padStart(2, '0')}</em>
          </span>
          <span className="mono kicker">{p.kicker}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <ul className="feature-list">
          {p.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <ul className="chips">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {p.link && (
          <a className="project-link" href={p.link} target="_blank" rel="noreferrer">
            Visit live <ArrowUpRight width={16} height={16} />
          </a>
        )}
      </div>
      <div className="project-visual">
        <Visual />
      </div>
    </TiltCard>
  )
}

/** Desktop: the section pins and project panels glide horizontally as you scroll. */
function HorizontalGallery() {
  const wrap = useRef(null)
  const track = useRef(null)
  const dist = useRef(0)
  const [height, setHeight] = useState('100vh')

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      dist.current = Math.max(0, track.current.scrollWidth - window.innerWidth)
      setHeight(`calc(100vh + ${dist.current}px)`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * dist.current)
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <div ref={wrap} className="hscroll" style={{ height }}>
      <div className="hscroll-sticky">
        <motion.div ref={track} className="hscroll-track" style={{ x }}>
          <div className="hscroll-intro">
            <SectionHeading index="04" eyebrow="Selected work" title="Things I've" accent="built." />
            <p className="muted">
              A look at the products and foundations I work on. Keep scrolling — the gallery moves with you.
            </p>
            <span className="hscroll-hint mono">Scroll →</span>
          </div>
          {projects.map((p, i) => (
            <div key={p.id} className="hscroll-item">
              <ProjectPanel p={p} i={i} total={projects.length} />
            </div>
          ))}
          <div className="hscroll-outro">
            <a href={profile.github} target="_blank" rel="noreferrer" className="outro-link">
              <GitHub width={28} height={28} />
              <span>More on GitHub</span>
              <ArrowUpRight width={28} height={28} />
            </a>
          </div>
        </motion.div>
        <div className="hscroll-progress">
          <motion.span style={{ scaleX: progress }} />
        </div>
      </div>
    </div>
  )
}

function StackedGallery() {
  return (
    <div className="container">
      <SectionHeading index="04" eyebrow="Selected work" title="Things I've" accent="built." />
      <div className="project-stack">
        {projects.map((p, i) => (
          <Reveal key={p.id} y={60}>
            <ProjectPanel p={p} i={i} total={projects.length} />
          </Reveal>
        ))}
      </div>
      <Reveal className="work-more">
        <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost glass">
          <GitHub /> More on GitHub <ArrowUpRight width={16} height={16} />
        </a>
      </Reveal>
    </div>
  )
}

export default function Projects() {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 640px)')
  const reduced = useReducedMotion()
  const horizontal = wide && !reduced
  return (
    <section id="work" className={`section work ${horizontal ? 'work-horizontal' : ''}`}>
      {horizontal ? <HorizontalGallery /> : <StackedGallery />}
    </section>
  )
}
