import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { profile, stats } from '../data/content'
import { useFinePointer, useMediaQuery, useReducedMotion } from '../hooks'
import { ArrowDown, ArrowUpRight, GitHub, LinkedIn, Mail } from './Icons'
import { CountUp, ease, Magnetic, ScrambleText, SplitText } from './Motion'

const HeroScene = lazy(() => import('../three/HeroScene'))

/** Pointer position normalised to -0.5..0.5, smoothed. */
function usePointerParallax(enabled) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  useEffect(() => {
    if (!enabled) return
    const f = (e) => {
      mx.set(e.clientX / innerWidth - 0.5)
      my.set(e.clientY / innerHeight - 0.5)
    }
    addEventListener('pointermove', f, { passive: true })
    return () => removeEventListener('pointermove', f)
  }, [enabled, mx, my])
  return [useSpring(mx, { stiffness: 50, damping: 18 }), useSpring(my, { stiffness: 50, damping: 18 })]
}

function HudPanel({ sx, sy, depth, className, delay, ready, children }) {
  const x = useTransform(sx, (v) => v * depth)
  const y = useTransform(sy, (v) => v * depth)
  return (
    <motion.div className={`hud ${className}`} style={{ x, y }}>
      <motion.div
        className="hud-inner glass"
        initial={{ opacity: 0, scale: 0.9, rotateX: 25, y: 30 }}
        animate={ready ? { opacity: 1, scale: 1, rotateX: 0, y: 0 } : {}}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const compact = useMediaQuery('(max-width: 820px)')
  const [sx, sy] = usePointerParallax(fine && !reduced)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.75], ['blur(0px)', 'blur(8px)'])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.02 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const show = (d) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay: d, ease },
  })

  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="hero-beam" aria-hidden="true" />

      <motion.div className="hero-scene" style={{ y: sceneY, opacity: fade }} aria-hidden="true">
        {reduced ? (
          <div className="hero-scene-fallback" />
        ) : (
          <Suspense fallback={<div className="hero-scene-fallback" />}>
            {ready && <HeroScene active={inView} compact={compact} />}
          </Suspense>
        )}
      </motion.div>

      {/* Floating glass HUD around the 3D core */}
      <div className="hud-layer" aria-hidden="true">
        <HudPanel sx={sx} sy={sy} depth={-40} className="hud-status" delay={1.0} ready={ready}>
          <span className="badge-dot" />
          <div>
            <small className="mono">STATUS</small>
            <strong>Available for work</strong>
          </div>
        </HudPanel>
        <HudPanel sx={sx} sy={sy} depth={55} className="hud-code" delay={1.15} ready={ready}>
          <div className="hud-code-bar">
            <i /><i /><i />
            <span className="mono">dev.js</span>
          </div>
          <pre className="mono">
            <span className="tk-k">const</span> <span className="tk-v">chetan</span> = {'{'}
            {'\n'}  stack: <span className="tk-s">'MERN'</span>,
            {'\n'}  base: <span className="tk-s">'Ahmedabad'</span>,
            {'\n'}  ships: <span className="tk-b">true</span>,
            {'\n'}{'}'}
          </pre>
        </HudPanel>
        <HudPanel sx={sx} sy={sy} depth={-25} className="hud-metric" delay={1.3} ready={ready}>
          <small className="mono">SHIPPING SINCE</small>
          <strong className="grad-text">Jul 2025</strong>
          <span className="hud-bars">
            {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
            ))}
          </span>
        </HudPanel>
      </div>

      <motion.div className="container hero-content" style={{ y: textY, opacity: fade, filter: blur }}>
        <motion.div className="badge glass" {...show(0.1)}>
          <span className="badge-dot" />
          Currently building at <b>Unada Labs</b>
        </motion.div>

        <h1 className="hero-title">
          {ready && (
            <>
              <span className="hero-hello mono">
                <SplitText text="// Hello, I'm" animateOnMount delay={0.2} />
              </span>
              <SplitText text={profile.first} className="hero-name" animateOnMount delay={0.3} />
              <SplitText text={profile.last} className="hero-name hero-name-grad" animateOnMount delay={0.42} />
            </>
          )}
        </h1>

        <motion.p className="hero-role" {...show(0.6)}>
          <span className="hero-role-prefix mono">&gt;_</span>
          <ScrambleText words={profile.rotating} running={ready && inView} className="hero-role-text" />
          <span className="caret" />
        </motion.p>

        <motion.p className="hero-lead" {...show(0.7)}>
          Full-stack developer crafting responsive, high-performance web apps — crisp React interfaces up front,
          RESTful Node &amp; Express APIs and MongoDB underneath.
        </motion.p>

        <motion.div className="hero-actions" {...show(0.8)}>
          <Magnetic>
            <a href="#work" className="btn btn-primary">
              <span>Explore my work</span> <ArrowUpRight />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost glass">
              Start a project
            </a>
          </Magnetic>
        </motion.div>

        <motion.ul className="hero-stats" {...show(0.95)}>
          {stats.map((s) => (
            <li key={s.label}>
              <strong>{s.num != null ? <CountUp to={s.num} from={s.from ?? 0} decimals={s.decimals ?? 0} /> : s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div className="hero-rail" {...show(1.3)}>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedIn width={16} height={16} /></a>
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHub width={16} height={16} /></a>
        <a href={`mailto:${profile.email}`} aria-label="Email"><Mail width={16} height={16} /></a>
        <span className="hero-rail-line" />
        <span className="mono hero-rail-text">Ahmedabad · IN</span>
      </motion.div>

      <motion.a href="#about" className="scroll-cue" aria-label="Scroll to about" {...show(1.4)}>
        <span className="scroll-cue-wheel"><span /></span>
        <span className="mono">Scroll to explore</span>
        <ArrowDown width={14} height={14} />
      </motion.a>
    </section>
  )
}
