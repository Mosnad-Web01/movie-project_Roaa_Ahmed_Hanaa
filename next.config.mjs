/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'], // أضف نطاق "image.tmdb.org" هنا
  },
  // إضافة دعم للشرطات المائلة النهائية على الروابط إذا كانت ضرورية
  trailingSlash: true,

  // إعدادات إعادة التوجيه إذا كنت بحاجة إليها
  redirects: async () => {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
