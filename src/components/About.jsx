import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { education, languages, profile, statement } from '../data/content'
import { Cap, Globe, Pin } from './Icons'
import { Reveal, ScrollRevealText, SectionHeading, TiltCard } from './Motion'

const marqueeItems = ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Tailwind', 'MySQL', 'JavaScript', 'Claude AI', 'Git']

export function Marquee() {
  const row = [...marqueeItems, ...marqueeItems]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-row">
        <div className="marquee-track">
          {row.map((t, i) => (
            <span key={i} className="marquee-item">
              {t}
              <i className="marquee-star">✦</i>
            </span>
          ))}
        </div>
      </div>
      <div className="marquee-row marquee-row-alt">
        <div className="marquee-track marquee-reverse">
          {row.map((t, i) => (
            <span key={i} className="marquee-item">
              {t}
              <i className="marquee-star">◆</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Statement() {
  return (
    <section className="statement" aria-label="Statement">
      <div className="container">
        <span className="mono statement-label">( Manifesto )</span>
        <ScrollRevealText text={statement} className="statement-text" />
      </div>
    </section>
  )
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const orbit = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container about-grid">
        <div className="about-visual">
          <TiltCard className="portrait" max={12}>
            <div className="portrait-frame">
              <motion.img
                src="./images/chetan.webp"
                alt="Portrait of Chetan Suthar"
                loading="lazy"
                decoding="async"
                width="800"
                height="800"
                style={{ y: imgY }}
              />
              <div className="portrait-shade" />
            </div>
            <div className="portrait-chip portrait-chip-top glass" style={{ transform: 'translateZ(60px)' }}>
              <span className="badge-dot" /> Open to opportunities
            </div>
            <div className="portrait-chip portrait-chip-bottom glass" style={{ transform: 'translateZ(80px)' }}>
              <span className="mono">role</span>
              <strong>MERN Stack Developer</strong>
            </div>
          </TiltCard>
          <motion.div className="about-orbit" style={{ rotate: orbit }} aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <defs>
                <path id="circlePath" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text>
                <textPath href="#circlePath">FULL-STACK · MERN · REACT · NODE · MONGODB · </textPath>
              </text>
            </svg>
          </motion.div>
        </div>

        <div className="about-copy">
          <SectionHeading index="01" eyebrow="About me" title="Code that's clean," accent="products that feel fast." />
          <Reveal as="p" className="lead" delay={0.1}>
            {profile.summary}
          </Reveal>
          <Reveal as="p" className="muted" delay={0.2}>
            I care about the details users feel — snappy interactions, layouts that hold up on every screen, and APIs
            that just work. AI-assisted tooling is part of my daily workflow, helping me ship faster without cutting
            corners on quality.
          </Reveal>

          <div className="fact-grid">
            <Reveal className="fact glass" delay={0.1}>
              <Pin />
              <div>
                <span>Based in</span>
                <strong>{profile.city}</strong>
              </div>
            </Reveal>
            <Reveal className="fact glass" delay={0.18}>
              <Cap />
              <div>
                <span>{education.degree}</span>
                <strong>{education.cgpa} CGPA</strong>
              </div>
            </Reveal>
            <Reveal className="fact glass" delay={0.26}>
              <Globe />
              <div>
                <span>Speaks</span>
                <strong>{languages.join(' · ')}</strong>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
