/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "digitalhippo-liard.vercel.app",
        port: "**",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
