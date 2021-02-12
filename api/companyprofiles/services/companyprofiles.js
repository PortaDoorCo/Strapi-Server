'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    async add(data, { files } = {}) {
        const entry = await strapi.query('companyprofiles').create(data);

        if (files) {
            // automatically uploads the files based on the entry and the model
            await strapi.entityService.uploadFiles(entry, files, {
                model: strapi.models.companyprofiles,
            });
            return this.findOne({ id: entry.id });
        }

        return entry;
    },
    async update(params, data, { files } = {}) {
        const entry = await strapi.query('companyprofiles').update(params, data);

        if (files) {
            // automatically uploads the files based on the entry and the model
            await this.uploadFiles(entry, files, { model: strapi.models.companyprofiles });
            return this.findOne({ id: entry.id });
        }
        return entry;
    },
    async find(populate) {
        const results = await strapi.query('companyprofiles').find(params, populate);
        return _.first(results) || null;
      },

    async findAll(populate) {
    const results = await strapi.query('companyprofiles').find(params, populate);
    return _.first(results) || null;
    },
    findOne(params, populate) {
        return strapi.query('companyprofiles').findOne(params, populate);
      },
};
