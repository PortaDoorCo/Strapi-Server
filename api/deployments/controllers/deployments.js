'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    async create(ctx) {
        strapi.emitToAllUsers("new_deployment", ctx.request.body);
      },
};
