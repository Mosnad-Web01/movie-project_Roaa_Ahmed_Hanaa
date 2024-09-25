// src/app/api/suggestions.js
import useSWR from 'swr'
import { fetchFromTMDB } from '../../lib/tmdbClient';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // استدعاء واجهة برمجة التطبيقات الخاصة بالبحث لجلب الاقتراحات
    const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);

    if (data && data.results) {
      // استخراج أسماء الأفلام أو المسلسلات أو الأشخاص من النتائج
      const suggestions = data.results.map(item => {
        return item.title || item.name; // استخدام title للأفلام وname للمسلسلات
      });

      return res.status(200).json(suggestions);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
