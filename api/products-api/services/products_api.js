"use strict";

const _ = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async find(params, id, populate) {
    return strapi.query(id).find(params, populate);
  },
  async getProducts(params, id, populate) {
    return strapi.query(id).find(params, populate);
  },

  async updateProduct(params, data, { files } = {}) {
    const { id, product } = params;

    const entry = await strapi.query(product).update({ id }, data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: eval(`strapi.api.${_.snakeCase(product)}.models`),
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return strapi.query(product).findOne({ id: entry.id });
    }

    return entry;
  },

  getSingleProduct(params, populate) {
    const { id, product } = params;

    console.log('params', params)

    return strapi.query(product).findOne({ id }, populate);
  },

  async addProduct(data, collection, { files } = {}) {
    const entry = await strapi.query(collection).create(data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: eval(`strapi.api.${_.snakeCase(collection)}.models`),
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },

  async deleteProduct(params, data) {
    const { id, product } = params;
    const entry = await strapi.query(product).delete({ id });
    return entry;
  },
};
