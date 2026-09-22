import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { ClickSpark } from '@/components/ui/ClickSpark'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/hero/Hero'
import { About } from '@/components/about/About'
import { Education } from '@/components/education/Education'
import { Skills } from '@/components/skills/Skills'
import { lazy, Suspense } from 'react'
import { Projects } from '@/components/projects/Projects'
import { GitHubActivity } from '@/components/github/GitHubActivity'
import { Certifications } from '@/components/certifications/Certifications'
import { Milestones } from '@/components/milestones/Milestones'

// Coding pulls in the charts library — load it lazily so it doesn't weigh down
// the initial bundle (it lives below the fold).
const Coding = lazy(() =>
  import('@/components/coding/Coding').then((m) => ({ default: m.Coding })),
)
import { Journey } from '@/components/journey/Journey'
import { Assistant } from '@/components/assistant/Assistant'
import { Contact } from '@/components/contact/Contact'
import { ChatWidget } from '@/components/chatbot/ChatWidget'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <AuroraBackground />
      <ScrollProgress />
      <ClickSpark />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <GitHubActivity />
        <Certifications />
        <Suspense
          fallback={<div className="section-pad container-px text-center text-muted-foreground">Loading coding activity…</div>}
        >
          <Coding />
        </Suspense>
        <Milestones />
        <Journey />
        <Assistant />
        <Contact />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
