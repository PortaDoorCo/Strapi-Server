'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */
var _ = require('lodash');


module.exports = {
    async create(data, { files } = {}) {
        const path  = _.kebabCase("printer_options")
        const validData = await strapi.entityValidator.validateEntityCreation(
          strapi.models[path], 
          data
        );
    
        const entry = await strapi.query('printer-options').create(validData);

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
