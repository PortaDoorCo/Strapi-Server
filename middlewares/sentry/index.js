const Sentry = require('@sentry/node');

const dsn = process.env.SENTRY_DSN

Sentry.init({
  dsn: dsn,
  environment: strapi.config.environment,
});

module.exports = strapi => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      });
    },
  };
};