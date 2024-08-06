const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const path = require("path");

module.exports = withNextIntl({
  i18n: {
    locales: ["en", "de", "uk", "ru"],
    defaultLocale: "en",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
});
