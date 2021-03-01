'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

var _ = require('lodash');

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const path  = _.kebabCase("printer_options")

module.exports = {
    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services[path].create(data, { files });
        } else {
          entity = await strapi.services[path].create(ctx.request.body);
        }
        strapi.emitToAllUsers("printer_option_added", entity);
        return sanitizeEntity(entity, { model: strapi.models[path] });
      },
      async update(ctx) {
        const { id } = ctx.params;
        let entity;
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services[path].update({ id }, data, {
            files,
          });
        } else {
          entity = await strapi.services[path].update({ id }, ctx.request.body);
        }

        strapi.emitToAllUsers("printer_option_updated", ctx.params, entity);
        return sanitizeEntity(entity, { model: strapi.models[path] });
      },
};
