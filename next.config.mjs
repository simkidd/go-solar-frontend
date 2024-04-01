/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID,
  },
  images: {
    domains: ["i.pravatar.cc", "cdn.dummyjson.com"],
  },
};

export default nextConfig;
