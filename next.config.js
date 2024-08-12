const nextCofig = {
    output: 'standalone', // mine worked fine without this line
    // ... other config
  }
  
  /** @type {import('next').NextConfig} */
  
  // Remove this if you're not using Fullcalendar features
  
  module.exports = {
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
      esmExternals: false
    },
  
    
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true
    },
    typescript: {
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      ignoreBuildErrors: true
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "storage.googleapis.com",
          port: "",
        },
      ],
      domains: ["storage.googleapis.com"],
    },
  }