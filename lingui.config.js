module.exports = {
  locales: ["en", "tr"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locale/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
};
