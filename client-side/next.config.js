/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable App Router
  experimental: {
    appDir: true,
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
  
  // Disable static optimization for pages that need server-side functionality
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Handle any special webpack configurations if needed
    return config
  },
}

module.exports = nextConfig
