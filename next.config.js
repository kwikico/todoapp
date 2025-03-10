/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
  // Add this to prevent issues with Firebase modules
  experimental: {
    serverComponentsExternalPackages: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
}

module.exports = nextConfig; 