// src/app/page.js
import Main from '../components/Main';
import Trending from '../components/Trending';
import LatestTrailers from '../components/LatestTrailers';
import WhatsPopular from '../components/WhatsPopular';
import FreeToWatch from '../components/FreeToWatch';


export default function Home() {
  return (
    <div>
      <Main />
      <Trending />
      <LatestTrailers />
      <WhatsPopular />
      <FreeToWatch />
    </div>
  );
}
