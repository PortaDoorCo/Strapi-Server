"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const _ = require("lodash");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");

module.exports = {
  async find(params, populate) {
    const results = await strapi.query("orders").find(params, []);
    return _.first(results) || null;
  },

  async findAll(params, populate) {
    const results = await strapi.query("orders").find(params, []);
    return _.first(results) || null;
  },
  async add(data, { files } = {}) {
    const entry = await strapi.query("orders").create(data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: strapi.models.orders,
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
  async update(params, data, { files } = {}) {
    const entry = await strapi.query("orders").update(params, data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await this.uploadFiles(entry, files, { model: strapi.models.orders });
      return this.findOne({ id: entry.id });
    }
    return entry;
  },
  async update_status(params, data, { files } = {}) {
    const entry = await strapi.query("orders").update(params, data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await this.uploadFiles(entry, files, { model: strapi.models.orders });
      return this.findOne({ id: entry.id });
    }
    return entry;
  },
  delete(params) {
    return strapi.query("orders").delete(params);
  },
  findOne(params, populate) {
    return strapi.query("orders").findOne(params, populate);
  },
};
