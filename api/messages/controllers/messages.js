'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.messages.create(data, { files });
    } else {
      entity = await strapi.services.messages.create(ctx.request.body);
    }

    strapi.emitToAllUsers("message", entity);

    return sanitizeEntity(entity, { model: strapi.models.messages });
  },
};
