"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../lib/tmdbClient';
import Image from 'next/image';
import Link from 'next/link'; // استيراد Link للتنقل بين الصفحات
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'; // استيراد أيقونات التواصل الاجتماعي من react-icons

const PersonDetails = () => {
  const { id } = useParams(); // الحصول على معرف الممثل
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null); // روابط التواصل الاجتماعي
  const [isLoading, setIsLoading] = useState(true);
  const [movieGenres, setMovieGenres] = useState({});
  const [tvGenres, setTvGenres] = useState({});
  const [showFullBio, setShowFullBio] = useState(false); // هنا يتم تعريف الحالة الخاصة بـ showFullBio

  useEffect(() => {
    if (id) {
      const fetchPersonDetails = async () => {
        try {
          // جلب بيانات الممثل
          const personData = await fetchFromTMDB(`/person/${id}`);
          const creditsData = await fetchFromTMDB(`/person/${id}/combined_credits`);
          const externalIds = await fetchFromTMDB(`/person/${id}/external_ids`); // جلب روابط التواصل الاجتماعي
          
          const movieGenresData = await fetchFromTMDB(`/genre/movie/list`);
          const tvGenresData = await fetchFromTMDB(`/genre/tv/list`);
          
          if (personData && creditsData && externalIds && movieGenresData && tvGenresData) {
            setPerson(personData);
            setCredits(creditsData);
            setSocialLinks(externalIds); // تخزين روابط التواصل الاجتماعي
            
            // حفظ الأنواع ككائنات للمطابقة السريعة
            const movieGenresMap = {};
            movieGenresData.genres.forEach(genre => {
              movieGenresMap[genre.id] = genre.name;
            });
            setMovieGenres(movieGenresMap);

            const tvGenresMap = {};
            tvGenresData.genres.forEach(genre => {
              tvGenresMap[genre.id] = genre.name;
            });
            setTvGenres(tvGenresMap);

            setIsLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch person details:", error);
          setIsLoading(false);
        }
      };
      fetchPersonDetails();
    } else {
      console.error("No person ID found.");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!person || !credits) {
    return <div>No person details found.</div>;
  }

  // دالة لعرض نص مقطوع إذا كان طويلًا جدًا
  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.substring(0, length)}...`;
    }
    return text;
  };

  // دالة لاستخراج الأنواع (genres) لكل فيلم أو مسلسل
  const getGenresForRole = (role) => {
    const genreIds = role.genre_ids || [];
    const genreNames = genreIds.map(genreId => {
      if (role.media_type === 'movie') {
        return movieGenres[genreId];
      } else if (role.media_type === 'tv') {
        return tvGenres[genreId];
      }
      return null;
    }).filter(Boolean); // تجاهل القيم null
    return genreNames.join(', ');
  };

  // دالة لاستخراج جميع الأنواع المتاحة في أعمال الشخص
  const getAllGenres = () => {
    const allGenreIds = new Set();
    credits.cast.forEach(role => {
      role.genre_ids?.forEach(id => allGenreIds.add(id));
    });
    
    const allGenres = Array.from(allGenreIds).map(id => {
      return movieGenres[id] || tvGenres[id];
    }).filter(Boolean);

    return allGenres.join(', ');
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-8 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={person.name}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
              layout="responsive"
            />
          </div>
          <div className="md:w-3/4 md:ml-8">
            <h1 className="text-4xl font-bold mb-4">{person.name}</h1>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Known For:</h3>
              <p>{person.known_for_department}</p>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Birthday:</h3>
              <p>{person.birthday}</p>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Biography:</h3>
              <p>
                {showFullBio
                  ? person.biography
                  : truncateText(person.biography || "No biography available.", 300)}
              </p>
              {person.biography && person.biography.length > 300 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-blue-500 underline mt-2"
                >
                  {showFullBio ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            <hr className="my-4" />

            {/* Genres Section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Genres:</h3>
              <p>{getAllGenres() || "No genres available"}</p>
            </div>
            <hr className="my-4" />
            
            {/* Social Media Links */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Follow {person.name}:</h3>
              <div className="flex space-x-4 mt-2">
                {socialLinks?.twitter_id && (
                  <a href={`https://twitter.com/${socialLinks.twitter_id}`} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={32} className="text-blue-500" />
                  </a>
                )}
                {socialLinks?.instagram_id && (
                  <a href={`https://instagram.com/${socialLinks.instagram_id}`} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={32} className="text-pink-500" />
                  </a>
                )}
                {socialLinks?.facebook_id && (
                  <a href={`https://facebook.com/${socialLinks.facebook_id}`} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={32} className="text-blue-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Acting Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Acting</h2>
              <div className="flex overflow-x-scroll space-x-4">
                {credits.cast.map((role) => (
                  <Link
                    key={role.id}
                    href={role.media_type === 'movie' ? `/movies/${role.id}` : `/tv/${role.id}`}
                  >
                    <div className="min-w-[150px] cursor-pointer">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${role.poster_path}`}
                        alt={role.title || role.name}
                        width={150}
                        height={225}
                        className="rounded-lg"
                      />
                      <p className="mt-2 text-center">{role.title || role.name}</p>
                      <p className="text-center text-gray-400 text-sm">
                        {getGenresForRole(role)}
                      </p> {/* عرض الأنواع */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
