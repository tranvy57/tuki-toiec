import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // domains: ["static.athenaonline.vn"],
    // remotePatterns: [
    //   // Ảnh thật từ Study4
    //   {
    //     protocol: "https",
    //     hostname: "study4.com",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "www.study4.com",
    //   },
    //   // Ảnh qua proxy hoặc FE của bạn
    //   {
    //     protocol: "https",
    //     hostname: "tukitoeic.app",
    //   },
    //   {
    //     protocol: "http",
    //     hostname: "localhost",
    //   },
    //   { protocol: "https", hostname: "res.cloudinary.com" },
    // ],
  },

  eslint: {
    ignoreDuringBuilds: true, // không fail build vì ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // không fail build vì lỗi TS
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
