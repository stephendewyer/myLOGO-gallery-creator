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
        mongodb_clustername: 'cluster0',
        mongodb_database: 'development',
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
      mongodb_clustername: 'cluster0',
      mongodb_database: 'production',
    },
  };
  
};
