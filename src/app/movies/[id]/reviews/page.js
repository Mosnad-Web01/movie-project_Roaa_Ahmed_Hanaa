"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchFromTMDB } from '../../../../lib/tmdbClient';
import ShowHeader from '../../../../components/ShowHeader'; // استيراد ShowHeader

const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [show, setShow] = useState(null); // إضافة حالة show
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsData = await fetchFromTMDB(`/movie/${id}/reviews`);
        if (reviewsData && reviewsData.results) {
          setReviews(reviewsData.results);
        }

        const showData = await fetchFromTMDB(`/movie/${id}`); // جلب بيانات الفيلم
        setShow(showData); // تعيين بيانات الفيلم
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4">
      {show && <ShowHeader show={show} />} {/* إضافة ShowHeader */}
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Movie Reviews</h1>
        <p className="text-lg mb-4">
          Here you can find reviews for the movie. Share your thoughts and read what others have to say.
        </p>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold mb-2">{review.author}</h2>
              <p className="text-base">{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews available for this movie.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
