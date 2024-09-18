/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/assets/images/**", // First path
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**", // Second path
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: false,
};

export default nextConfig;
