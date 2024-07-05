/** @type {import('next').NextConfig} */
const {i18n} = require("./next-i18next.config")
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")

const prod = process.env.NODE_ENV === "production"


const nextConfig = {
  // images:{
  //   domains: ['source.unsplash.com']
  // },
  reactStrictMode: false,
  swcMinify:true,
  i18n,
  compress:true,
  optimizeFonts:true,
  eslint: {
    ignoreDuringBuilds: true
  },
  trailingSlash: false,
  pwa: {
    dest: 'public',
    disable: prod ? false : true,
    runtimeCaching
  },
}

module.exports = withPWA(nextConfig)
