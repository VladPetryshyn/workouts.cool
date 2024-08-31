const withPWA = require("next-pwa");
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const path = require("path");

const config = withPWA(
  {
    dest: "public", // destination directory for the PWA files
    disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
    register: true, // register the PWA service worker
    skipWaiting: true, // skip waiting for service worker activation
  },
  {
    experimental: {
      esmExternals: "loose", // <-- add this
      serverComponentsExternalPackages: ["mongoose"], // <-- and this
      serverActions: {
        bodySizeLimit: "5mb",
      },
    },
    env: {
      HOSTING_URL: process.env.HOSTING_URL,
    },
    sassOptions: {
      includePaths: [path.join(__dirname, "styles")],
    },
  },
);

module.exports = withNextIntl(config);
