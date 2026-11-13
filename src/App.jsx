import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import About, { Marquee, Statement } from './components/About'
import Background, { useGlassSpotlight } from './components/Background'
import { Cursor, Loader, Navbar, ScrollProgress, SideRail } from './components/Chrome'
import Contact, { Footer, Strengths } from './components/Contact'
import Experience from './components/Experience'
import Hero from './components/Hero'
import { Seam } from './components/Motion'
import Projects from './components/Projects'
import Skills from './components/Skills'

export default function App() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  useGlassSpotlight()

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} />}</AnimatePresence>
      <Background />
      <Cursor />
      <ScrollProgress />
      <div className="noise" aria-hidden="true" />
      <Navbar />
      <SideRail />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <Statement />
        <Seam />
        <About />
        <Seam />
        <Skills />
        <Seam />
        <Experience />
        <Seam />
        <Projects />
        <Seam />
        <Strengths />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
