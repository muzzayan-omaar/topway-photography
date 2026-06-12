import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsApp from "./components/WhatsApp/WhatsApp";

import Hero from "./components/Hero/Hero";
import Gallery from "./components/Gallery/Gallery";
import Stats from "./components/Stats/Stats";
import Occasions from "./components/Occasions/Occasions";
import ClientTestimonials from "./components/Testimonials/ClientTestimonials";
import CTA from "./components/CTA/CTA";

// Admin
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import ProtectedRoute from "./admin/components/ProtectedRoute";

function HomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#080808] text-white overflow-x-hidden">
        <Hero />
        <Gallery />
        <Stats />
        <Occasions />
        <ClientTestimonials />
        <CTA />
        <Footer />
      </main>

      <WhatsApp />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* FRONTEND */}
      <Route path="/" element={<HomePage />} />

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<Login />} />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;