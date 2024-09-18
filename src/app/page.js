// src/app/page.js
"use client"; // تأكيد أن الملف يعمل على جهة العميل

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; // مكتبة التمرير
import Main from '../components/Main';
import Trending from '../components/Trending';
import LatestTrailers from '../components/LatestTrailers';
import WhatsPopular from '../components/WhatsPopular';
import FreeToWatch from '../components/FreeToWatch';

// إعداد الحركات مع إضافة السلاسة والبطء
const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
  },
  flyIn: {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
  },
  floatDown: {
    hidden: { y: -100, opacity: 0 }, // جرب تقليل القيمة هنا
    visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
  },
  riseUp: {
    hidden: { y: 200, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
  },
  plus: {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }
  }
};

export default function Home() {
  const { ref: mainRef, inView: mainInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: trendingRef, inView: trendingInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: latestTrailersRef, inView: latestTrailersInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: whatsPopularRef, inView: whatsPopularInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: freeToWatchRef, inView: freeToWatchInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div>
      {/* Main - Fade Animation */}
      <motion.div ref={mainRef} initial="hidden" animate={mainInView ? "visible" : "hidden"} variants={variants.fade}>
        <Main />
      </motion.div>

      {/* Trending - Fly In Animation */}
      <motion.div ref={trendingRef} initial="hidden" animate={trendingInView ? "visible" : "hidden"} variants={variants.flyIn}>
        <Trending />
      </motion.div>

      {/* Latest Trailers - Float Down Animation */}
      <motion.div
        ref={latestTrailersRef}
        initial="hidden"
        animate={latestTrailersInView ? "visible" : "hidden"}
        variants={variants.flyIn}
      >
        <LatestTrailers />
      </motion.div>


      {/* Whats Popular - Rise Up Animation */}
      <motion.div ref={whatsPopularRef} initial="hidden" animate={whatsPopularInView ? "visible" : "hidden"} variants={variants.riseUp}>
        <WhatsPopular />
      </motion.div>

      {/* Free to Watch - Plus (Scale) Animation */}
      <motion.div ref={freeToWatchRef} initial="hidden" animate={freeToWatchInView ? "visible" : "hidden"} variants={variants.plus}>
        <FreeToWatch />
      </motion.div>
    </div>
  );
}
