import { Fragment, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../hooks'

export const ease = [0.22, 1, 0.36, 1]

/** Fades + lifts children into view once. */
export function Reveal({ children, delay = 0, y = 40, as = 'div', className, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Splits text into words that rise up from a mask. */
// The observer must watch the visible wrapper: the words start translated outside
// their overflow:hidden masks, so observing them directly would never fire.
const wordVariants = {
  hidden: { y: '110%' },
  show: (i) => ({ y: '0%', transition: { duration: 0.9, delay: i, ease } }),
}

export function SplitText({ text, className = '', delay = 0, stagger = 0.06, animateOnMount = false }) {
  const words = text.split(' ')
  const trigger = animateOnMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '-40px' } }
  return (
    <motion.span className={`split ${className}`} aria-label={text} role="text" initial="hidden" {...trigger}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-mask" aria-hidden="true">
            <motion.span className="split-word" variants={wordVariants} custom={delay + i * stagger}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  )
}

/** 3D perspective tilt that follows the pointer, with a moving glare. */
export function TiltCard({ children, className = '', max = 10, glare = true, ...rest }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const enabled = fine && !reduced

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const glareBg = useTransform(
    [sx, sy],
    ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.14), transparent 55%)`
  )

  const onMove = (e) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      {...rest}
    >
      {children}
      {glare && enabled && <motion.div className="tilt-glare" style={{ background: glareBg }} />}
    </motion.div>
  )
}

/** Wrapper that pulls its child toward the cursor. */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })
  const onMove = (e) => {
    if (!fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span ref={ref} className="magnetic" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEF'

/** Cycles through `words`, "decoding" each one through random glyphs. */
export function ScrambleText({ words, running = true, interval = 2800, className = '' }) {
  const [text, setText] = useState(words[0])
  const current = useRef(words[0])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!running) return
    let raf
    let i = 0
    const run = (to) => {
      const from = current.current
      const len = Math.max(from.length, to.length)
      const queue = Array.from({ length: len }, (_, k) => {
        const start = Math.floor(Math.random() * 10)
        return { from: from[k] || '', to: to[k] || '', start, end: start + 8 + Math.floor(Math.random() * 12) }
      })
      let frame = 0
      const tick = () => {
        let out = ''
        let done = 0
        for (const q of queue) {
          if (frame >= q.end) {
            done++
            out += q.to
          } else if (frame >= q.start) out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
          else out += q.from
        }
        setText(out)
        if (done < queue.length) {
          frame++
          raf = requestAnimationFrame(tick)
        } else current.current = to
      }
      tick()
    }
    const id = setInterval(() => {
      i = (i + 1) % words.length
      if (reduced) {
        current.current = words[i]
        setText(words[i])
      } else run(words[i])
    }, interval)
    return () => {
      clearInterval(id)
      cancelAnimationFrame(raf)
    }
  }, [running, words, interval, reduced])

  return (
    <span className={className} aria-live="polite">
      {text}
    </span>
  )
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({ to, from = 0, decimals = 0, duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(from)
  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, { duration, ease, onUpdate: setVal })
    return () => controls.stop()
  }, [inView, from, to, duration])
  return <span ref={ref}>{val.toFixed(decimals)}</span>
}

function ScrubWord({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const blur = useTransform(progress, range, ['blur(6px)', 'blur(0px)'])
  return (
    <motion.span className="scrub-word" style={{ opacity, filter: blur }}>
      {word}{' '}
    </motion.span>
  )
}

/** Large statement whose words light up as you scroll through it. */
export function ScrollRevealText({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrubWord key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  )
}

/** Glowing divider that draws out from the centre between sections. */
export function Seam() {
  return (
    <div className="seam" aria-hidden="true">
      <motion.span
        className="seam-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.6, ease }}
      />
      <motion.span
        className="seam-dot"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay: 0.6, ease }}
      />
    </div>
  )
}

export function SectionHeading({ index, eyebrow, title, accent }) {
  return (
    <div className="section-heading">
      <span className="ghost-index" aria-hidden="true">{index}</span>
      <Reveal className="eyebrow" y={20}>
        <span className="eyebrow-index">{index}</span>
        <span className="eyebrow-line" />
        {eyebrow}
      </Reveal>
      <h2 className="section-title">
        <SplitText text={title} />
        {accent && (
          <>
            {' '}
            <SplitText text={accent} className="accent-text" delay={0.15} />
          </>
        )}
      </h2>
    </div>
  )
}
