import { useState } from 'react'
import { profile, softSkills } from '../data/content'
import { ArrowUpRight, Check, Copy, GitHub, LinkedIn, Mail, Phone, Pin } from './Icons'
import { Magnetic, Reveal, SectionHeading, SplitText } from './Motion'

export function Strengths() {
  return (
    <section className="section strengths" aria-labelledby="strengths-title">
      <div className="container">
        <SectionHeading index="05" eyebrow="How I work" title="Beyond the" accent="code." />
        <div className="strength-grid" id="strengths-title">
          {softSkills.map((s, i) => (
            <Reveal key={s} delay={i * 0.06} className="strength">
              <span className="mono">0{i + 1}</span>
              <h3>{s}</h3>
              <span className="strength-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container">
        <Reveal className="eyebrow" y={20}>
          <span className="eyebrow-index">06</span>
          <span className="eyebrow-line" />
          Contact
        </Reveal>
        <h2 className="contact-title">
          <SplitText text="Let's build" />
          <br />
          <SplitText text="something great." className="accent-text" delay={0.2} />
        </h2>

        <Reveal className="contact-cta" delay={0.2}>
          <Magnetic strength={0.2}>
            <a href={`mailto:${profile.email}`} className="contact-mail glass">
              <Mail width={26} height={26} />
              <span>{profile.email}</span>
              <ArrowUpRight width={26} height={26} />
            </a>
          </Magnetic>
          <button className="btn btn-ghost btn-sm copy-btn glass" onClick={copy} aria-live="polite">
            {copied ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
            {copied ? 'Copied!' : 'Copy email'}
          </button>
        </Reveal>

        <div className="contact-grid">
          <Reveal delay={0.1}>
            <a className="contact-card glass" href={profile.phoneHref}>
              <Phone />
              <span>Phone</span>
              <strong>{profile.phone}</strong>
            </a>
          </Reveal>
          <Reveal delay={0.18}>
            <a className="contact-card glass" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkedIn />
              <span>LinkedIn</span>
              <strong>in/chetansuthar</strong>
            </a>
          </Reveal>
          <Reveal delay={0.26}>
            <a className="contact-card glass" href={profile.github} target="_blank" rel="noreferrer">
              <GitHub />
              <span>GitHub</span>
              <strong>chetansuthar0609</strong>
            </a>
          </Reveal>
          <Reveal delay={0.34}>
            <div className="contact-card glass">
              <Pin />
              <span>Location</span>
              <strong>{profile.location}</strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-big" aria-hidden="true">
          CHETAN<span>.</span>
        </span>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} {profile.name}.</span>
          <a href="#top" className="footer-top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
