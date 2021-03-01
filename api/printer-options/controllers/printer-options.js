'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

var _ = require('lodash');

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
    async create(ctx) {
        let entity;

        const path  = _.kebabCase("printer_options")

        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services[path].create(data, { files });
        } else {
          entity = await strapi.services[path].create(ctx.request.body);
        }
        strapi.emitToAllUsers("printer_option_added", ctx.params, entity);
        return sanitizeEntity(entity, { model: strapi.models[path] });
      },
};
