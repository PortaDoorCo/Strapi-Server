"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.deliveries.search(ctx.query);
    } else {
      entities = await strapi.services.deliveries.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.deliveries })
    );
  },
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.deliveries.create(data, { files });
    } else {
      entity = await strapi.services.deliveries.create(ctx.request.body);
    }

    await strapi.emitToAllUsers("delivery_added");
    return sanitizeEntity(entity, { model: strapi.models.deliveries });
  },
};
