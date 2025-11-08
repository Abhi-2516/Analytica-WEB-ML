import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer'; // 1. Import the Footer component

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer /> {/* 2. Add the Footer component here */}
    </div>
  );
}

export default App;