import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import Gallery from "./components/Gallery/Gallery";
import Stats from "./components/Stats/Stats";
import Occasions from "./components/Occasions/Occasions";
import ClientTestimonials from "./components/Testimonials/ClientTestimonials";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Gallery />
      <Stats />
      <Occasions />
      <ClientTestimonials />
      <CTA />
      <Footer />
    </main>
  );
}

export default App;