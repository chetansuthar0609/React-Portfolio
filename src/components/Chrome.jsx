import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { nav, profile } from '../data/content'
import { useActiveSection, useFinePointer, useReducedMotion } from '../hooks'
import { Close, Menu } from './Icons'
import { ease } from './Motion'

/** Intro curtain with a counting loader. */
export function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, reduced])

  return (
    <motion.div
      className="loader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="loader-inner">
        <motion.div className="loader-mark" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          CS<span>.</span>
        </motion.div>
        <div className="loader-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <div className="loader-meta">
          <span>Building experience</span>
          <span className="mono">{String(count).padStart(3, '0')}%</span>
        </div>
      </div>
    </motion.div>
  )
}

/** Thin scroll progress bar along the top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

/** Dot + trailing ring cursor; grows over interactive elements. Desktop only. */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!fine || reduced) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let raf

    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      const hit = e.target.closest?.('a, button, [data-cursor]')
      ring.current?.classList.toggle('is-hover', !!hit)
    }
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const down = () => ring.current?.classList.add('is-down')
    const up = () => ring.current?.classList.remove('is-down')

    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      removeEventListener('pointermove', move)
      removeEventListener('pointerdown', down)
      removeEventListener('pointerup', up)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

/** Fixed right-edge section indicator (desktop). */
export function SideRail() {
  const ids = useMemo(() => nav.map((n) => n.id), [])
  const active = useActiveSection(ids)
  return (
    <nav className="side-rail" aria-label="Section progress">
      {nav.map((n, i) => (
        <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} aria-label={n.label}>
          <span className="side-rail-label mono">
            0{i + 1} · {n.label}
          </span>
          <span className="side-rail-dot" />
        </a>
      ))}
    </nav>
  )
}

export function Navbar() {
  const ids = useMemo(() => nav.map((n) => n.id), [])
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
      >
        <a href="#top" className="nav-logo" aria-label="Back to top">
          <span className="nav-logo-mark">CS</span>
          <span className="nav-logo-text">
            {profile.name}
            <small>{profile.stack}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''}>
              {active === n.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="nav-link-label">{n.label}</span>
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn-primary btn-sm nav-cta">
          Let&apos;s talk
        </a>

        <button className="nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <Close /> : <Menu />}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 40px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <nav aria-label="Mobile">
              {nav.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                >
                  <span className="mono">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="mobile-menu-foot">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.city}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
