/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['zcvyhpeyczeb90av.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      }
    ],
  },
}

export default nextConfig