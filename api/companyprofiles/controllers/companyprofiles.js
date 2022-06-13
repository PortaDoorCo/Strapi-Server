"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const axios = require("axios");

module.exports = {
  create: async (ctx) => {
    // const customers = await strapi.query("companyprofiles").count();

    // const CUSTNO = customers + 1;

    // console.log("orders length", CUSTNO);

    const customer = {
      ...ctx.request.body,
      // CUSTNO: CUSTNO,
    };

    const data = await strapi.services.companyprofiles.add(customer);
    // Send 201 `created`
    ctx.created(data);
    // NEW LINE: call our method emitToAllUsers and pass it body request
    console.log({ data });
    strapi.emitToAllUsers("customer_added", data);
  },
  update: async (ctx) => {
    let entity;
    let entry;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entry = await strapi.query("companyprofiles").findOne(ctx.params);
      entity = await strapi.services.companyprofiles.update(ctx.params, data, {
        files,
      });
    } else {
      entry = await strapi.query("companyprofiles").findOne(ctx.params);
      entity = await strapi.services.companyprofiles.update(
        ctx.params,
        ctx.request.body
      );
    }

    console.log({ entry });
    console.log({ entity });

    strapi.emitToAllUsers("customer_updated", entity);
    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.query("companyprofiles").find(ctx.query);
    } else {
      entities = await strapi.query("companyprofiles").find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.companyprofiles })
    );
  },
  async findAll(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi
        .query("companyprofiles")
        .find({ _limit: 2500, _sort: "CUSTNO:ASC" });
    } else {
      entities = await strapi
        .query("companyprofiles")
        .find({ _limit: 2500, _sort: "CUSTNO:ASC" });
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.companyprofiles })
    );
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.companyprofiles.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.companyprofiles });
  },
  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.companyprofiles.delete({ id });
    console.log({ entity });
    strapi.emitToAllUsers("customer_deleted", entity);
    return sanitizeEntity(entity, { model: strapi.models.companyprofiles });
  },
};
