'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const axios = require("axios");

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
          entities = await strapi.query("breakdowns").find({_sort: 'Item:ASC'});
        } else {
          entities = await strapi.query("breakdowns").find({_sort: 'Item:ASC'});
        }
    
        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.breakdowns }));
      },
};
