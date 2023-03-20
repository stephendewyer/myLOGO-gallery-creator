const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');


module.exports = (phase) => {

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      i18n: {
        locales: ["en-US"],
        defaultLocale: "en-US",
      },
      env: {
        mongodb_username: 'stephendewyer',
        mongodb_password: 'WOAFZAKvojPo0TTM',
        mongodb_clustername: 'cluster01',
        mongodb_database: 'development',
        NEXTAUTH_SECRET: "ac69f709e8989043e27df5ddeca612dd",
        CLOUDINARY_URL: "cloudinary://953156592933315:xopLcT5s2cTlKb8ucw_oWjpFDp0@dsztjf1mf",
        indexURL: "http://localhost:3000",
        SendGrid_API_key: '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',
      },
    };
  }
  return {
    reactStrictMode: true,
    i18n: {
      locales: ["en-US"],
      defaultLocale: "en-US",
    },
    env: {
      mongodb_username: 'stephendewyer',
      mongodb_password: 'WOAFZAKvojPo0TTM',
      mongodb_clustername: 'cluster01',
      mongodb_database: 'production',
      NEXTAUTH_SECRET: "ac69f709e8989043e27df5ddeca612dd",
      CLOUDINARY_URL: "cloudinary://953156592933315:xopLcT5s2cTlKb8ucw_oWjpFDp0@dsztjf1mf",
      indexURL: "https://my-logo-gallery-creator.vercel.app",
      SendGrid_API_key: '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',
    },
  };
  
};
