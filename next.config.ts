/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Add your own image domains here if you're using external image hosting
      // {
      //   protocol: 'https',
      //   hostname: 'your-cloudinary-domain.com',
      // },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig