import Background from '@/components/Background';
import Effects from '@/components/Effects';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PageviewTracker from '@/components/PageviewTracker';

export default function Home() {
  return (
    <>
      <PageviewTracker />
      <Background />
      <Effects />
      <Nav />
      <div id="top" className="relative z-[2] w-full">
        <Hero />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
