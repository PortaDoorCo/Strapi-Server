'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


module.exports = {
    async create(ctx) {
        strapi.emitToAllUsers("new_release", ctx.request.body);
        return
      },
};
