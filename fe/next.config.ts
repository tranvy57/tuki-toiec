import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
