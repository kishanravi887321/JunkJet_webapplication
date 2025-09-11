/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable App Router and server components
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },
  
  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'via.placeholder.com'
    ],
  },
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Handle any special webpack configurations if needed
    return config
  },
}

module.exports = nextConfig
