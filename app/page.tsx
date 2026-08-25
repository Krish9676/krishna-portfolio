import Navigation from "@/components/Navigation";
import Backdrop from "@/components/visuals/Backdrop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import DomainExpertise from "@/components/sections/DomainExpertise";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Sits behind every section; the hero adds its own stronger layer */}
      <Backdrop variant="site" />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <DomainExpertise />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
