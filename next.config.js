const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');


module.exports = (phase) => {

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      i18n: {
        locales: ["en-US"],
        defaultLocale: "en-US"
      },
      env: {
        indexURL: "http://localhost:3000",
        NEXTAUTH_SECRET: "ac69f709e8989043e27df5ddeca612dd",
        MONGODB_DATABASE: 'development'
      }
    };
  }
  return {
    reactStrictMode: true,
    i18n: {
      locales: ["en-US"],
      defaultLocale: "en-US"
    },
    env: {
      indexURL: "https://my-logo-gallery-creator.vercel.app",
      NEXTAUTH_SECRET: "ac69f709e8989043e27df5ddeca612dd",
      MONGODB_DATABASE: 'production'
    }
  };
  
};
