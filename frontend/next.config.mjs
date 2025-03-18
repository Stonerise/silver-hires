/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // API proxying configuration
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`, 
      },
    ];
  },
};

export default nextConfig;