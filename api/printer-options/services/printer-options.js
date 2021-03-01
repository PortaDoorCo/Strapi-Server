"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */
var _ = require("lodash");

const path = _.kebabCase("printer_options");

module.exports = {
  async create(data, { files } = {}) {
    
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models[path],
      data
    );

    const entry = await strapi.query("printer-options").create(validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: "printer-options",
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
  async update(params, data, { files } = {}) {
    const existingEntry = await strapi.query('printer-options').findOne(params);


    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models[path], 
      data
    );

    const entry = await strapi.query('printer-options').update(params, validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'printer-options',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },

};
