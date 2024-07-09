/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "production" ? false : true,
  runtimeCaching: require("next-pwa/cache"),
});

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  compress: true,
  optimizeFonts: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
};

module.exports = withPWA(nextConfig);
