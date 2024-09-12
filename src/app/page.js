// src/app/page.js
import Navbar from '../components/Navbar'; // Ensure correct path
import Main from '../components/Main';
import Trending from '../components/Trending';
import LatestTrailers from '../components/LatestTrailers.js';
import WhatsPopular from '../components/WhatsPopular.js';
import FreeToWatch from '../components/FreeToWatch.js';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Main />
      <Trending />
      <LatestTrailers/>
      <WhatsPopular/>
      <FreeToWatch/>
      <Footer/>
    </div>
  );
}
