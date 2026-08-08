import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Gallery from './components/Gallery'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Music from './components/Music'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Gallery />
        <Projects />
        <Experience />
        <Music />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
