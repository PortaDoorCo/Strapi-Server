'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {

    async create(data, { files } = {}) {

        const validData = await strapi.entityValidator.validateEntityCreation(
          strapi.models.messages,
          data,
        );
    
        const entry = await strapi.query('messages').create(validData);
    
        if (files) {
          // automatically uploads the files based on the entry and the model
          await strapi.entityService.uploadFiles(entry, files, {
            model: 'messages',
            // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
          });
          return this.findOne({ id: entry.id });
        }
    
        return entry;
      },

};
