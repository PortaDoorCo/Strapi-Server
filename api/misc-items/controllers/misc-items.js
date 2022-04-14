"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

const test = "misc-items";

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["misc-items"].create(data, { files });
    } else {
      console.log({ services: strapi.services["misc-items"] });
      entity = await strapi.services["misc-items"].create(ctx.request.body);
    }
    console.log("hiiii");
    strapi.emitToAllUsers("misc_item_added", ctx.params, entity);
    return sanitizeEntity(entity, { model: strapi.models["misc-items"] });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["misc-items"].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services["misc-items"].update(
        { id },
        ctx.request.body
      );
    }

    strapi.emitToAllUsers("misc_item_updated", entity);

    return sanitizeEntity(entity, { model: strapi.models["misc-items"] });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services["misc-items"].delete({ id });
    strapi.emitToAllUsers("misc_item_deleted", entity);
    return sanitizeEntity(entity, { model: strapi.models["misc-items"] });
  },
};
