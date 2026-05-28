import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import Gallery from "./components/Gallery/Gallery";

function App() {
  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Gallery />
    </main>
  );
}

export default App;