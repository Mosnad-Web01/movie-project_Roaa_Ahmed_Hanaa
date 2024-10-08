const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';


export const fetchFromTMDB = async (endpoint, language = 'en-US') => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=${language}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  } 
};


