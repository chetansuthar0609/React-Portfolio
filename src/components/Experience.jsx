import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { education, experience } from '../data/content'
import { Reveal, SectionHeading, TiltCard } from './Motion'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <SectionHeading index="03" eyebrow="Experience" title="Where I've been" accent="shipping." />

        <div className="timeline" ref={ref}>
          <div className="timeline-rail" aria-hidden="true">
            <motion.div className="timeline-rail-fill" style={{ scaleY }} />
          </div>

          {experience.map((job) => (
            <div key={job.company} className="timeline-item">
              <span className="timeline-node" aria-hidden="true">
                <span />
              </span>
              <Reveal>
                <TiltCard className="job-card glass" max={4}>
                  <div className="job-head">
                    <div>
                      <span className="mono job-period">
                        {job.current && <span className="badge-dot" />}
                        {job.period}
                      </span>
                      <h3>{job.role}</h3>
                      <p className="job-company">@ {job.company}</p>
                    </div>
                    {job.current && <span className="pill-live">Current</span>}
                  </div>
                  <ul className="job-points">
                    {job.points.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                      >
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                  <ul className="chips">
                    {job.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            </div>
          ))}

          <div className="timeline-item">
            <span className="timeline-node timeline-node-muted" aria-hidden="true">
              <span />
            </span>
            <Reveal>
              <TiltCard className="job-card job-card-edu glass" max={4}>
                <div className="job-head">
                  <div>
                    <span className="mono job-period">{education.period}</span>
                    <h3>{education.degree}</h3>
                    <p className="job-company">@ {education.school}</p>
                  </div>
                  <div className="cgpa">
                    <strong>{education.cgpa}</strong>
                    <span>CGPA</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
