import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage;