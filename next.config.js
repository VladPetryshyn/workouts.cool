// const withPWA = require("next-pwa");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const path = require("path");

const config = {
  experimental: {
    esmExternals: "loose", // <-- add this
    serverComponentsExternalPackages: ["mongoose"], // <-- and this
    serverActions: {
      bodySizeLimit: "6mb",
      responseLimit: "6mb",
    },
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
};

//withPWA(
//  {
//    dest: "public", // destination directory for the PWA files
//    disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
//    register: true, // register the PWA service worker
//    skipWaiting: true, // skip waiting for service worker activation
//  },
//);

module.exports = withNextIntl(config);
