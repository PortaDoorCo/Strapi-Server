"use strict";
const exportEdges = require("./exportEdges");
const exportRazor = require("./exportRazor");
const _ = require("lodash");

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
      entities = await strapi.query("orders").find(ctx.query);
    } else {
      entities = await strapi.query("orders").find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.orders })
    );
  },
  async findAll(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi
        .query("orders")
        .find({ _limit: 10000, _sort: "orderNum:DESC" });
    } else {
      entities = await strapi
        .query("orders")
        .find({ _limit: 10000, _sort: "orderNum:DESC" });
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.orders })
    );
  },
  create: async (ctx) => {
    const orders = await strapi
      .query("orders")
      .find({ _limit: 1, _sort: "orderNum:desc" });

    console.log("orders", orders);

    const orderNum = orders[0].id + 101;

    console.log("orders length", orders);

    const order = {
      ...ctx.request.body,
      orderNum: orderNum,
    };

    const data = await strapi.services.orders.add(order);
    // Send 201 `created`
    ctx.created(data);
    // NEW LINE: call our method emitToAllUsers and pass it body request
    strapi.emitToAllUsers("order_submitted", data);

    const url = process.env.SLACK_WEBHOOK;
    const slackData = {
      text: `Order #${order.orderNum} has been added`,
      blocks: [
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Order *#${order.orderNum}* has been added by *${order.submittedBy}*`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Details:* \n\n Customer: *${order.job_info.customer.Company}* \n\n  Job Name: *${order.job_info.poNum}* \n\n Order Type: *${order.orderType}* \n\n Order Status: *${order.status}* \n `,
          },
        },
        {
          type: "divider",
        },
      ],
    };

    axios.post(url, JSON.stringify(slackData), {
      withCredentials: false,
      transformRequest: [
        (slackData, headers) => {
          delete headers.post["Content-Type"];
          return slackData;
        },
      ],
    });
  },
  update: async (ctx) => {
    let entity;
    const item = ctx.request.body;
    let exported = item.exported ? item.exported : false;
    const breakdowns = await strapi
      .query("breakdowns")
      .find({ _sort: "id:ASC" });
    if (
      !item.status?.includes("Quote") &&
      !item.status?.includes("Invoiced") &&
      !item.status?.includes("Ordered") &&
      !item.status?.includes("Complete") &&
      !item.status?.includes("Shipped") &&
      !item.exported &&
      item.orderType === "Door Order"
    ) {
      // await exportEdges([item])
      // await exportRazor([item], breakdowns)
      exported = true;
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.orders.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.orders.update(ctx.params, {
        ...ctx.request.body,
        exported: exported,
      });
    }

    if (
      !item.status?.includes("Quote") &&
      !item.status?.includes("Invoiced") &&
      !item.status?.includes("Ordered") &&
      !item.status?.includes("Complete") &&
      !item.status?.includes("Shipped") &&
      !item.exported &&
      item.orderType === "Door Order"
    ) {
      await exportEdges([item]);
      await exportRazor([item], breakdowns);
    }
    await strapi.emitToAllUsers("order_updated", entity, ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
  update_status: async (ctx) => {
    let entity;

    const item = ctx.request.body;
    let exported = item.exported ? item.exported : false;

    console.log({ item });

    const breakdowns = await strapi
      .query("breakdowns")
      .find({ _sort: "id:ASC" });
    if (
      !item.status?.includes("Quote") &&
      !item.status?.includes("Invoiced") &&
      !item.status?.includes("Ordered") &&
      !item.status?.includes("Complete") &&
      !item.status?.includes("Shipped") &&
      !item.exported &&
      item.orderType === "Door Order"
    ) {
      // await exportEdges([item])
      // await exportRazor([item], breakdowns)
      exported = true;
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.orders.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.orders.update(ctx.params, {
        ...ctx.request.body,
        exported: exported,
      });
    }

    const body = ctx.request.body;
    strapi.emitToAllUsers("status_updated", entity, ctx.request.body);

    // console.log(entry)

    if (
      !item.status?.includes("Quote") &&
      !item.status?.includes("Invoiced") &&
      !item.status?.includes("Ordered") &&
      !item.status?.includes("Complete") &&
      !item.status?.includes("Shipped") &&
      !item.exported &&
      item.orderType === "Door Order"
    ) {
      await exportEdges([item]);
      await exportRazor([item], breakdowns);
    }

    const url = process.env.SLACK_WEBHOOK;
    const slackData = {
      text: `Order #${entity.orderNum} status changed to *${body.status}*`,
      blocks: [
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Order *#${entity.orderNum}* status changed to *${body.status}*`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Details:* \n\n Customer: *${entity.job_info.customer.Company}* \n\n Job Name: *${entity.job_info.poNum}* \n\n Order Type: *${entity.orderType}* \n\n Order Status: *${body.status}* \n`,
          },
        },
        {
          type: "divider",
        },
      ],
    };

    axios.post(url, JSON.stringify(slackData), {
      withCredentials: false,
      transformRequest: [
        (slackData, headers) => {
          delete headers.post["Content-Type"];
          return slackData;
        },
      ],
    });

    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
  delete: async (ctx) => {
    const entity = await strapi.services.orders.delete(ctx.params);
    console.log("entity", entity);
    strapi.emitToAllUsers("order_deleted", entity);
    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.orders.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
  searchItems: async (ctx) => {
    console.log({ ctx: ctx.query });

    let searchTerm = ctx.query.searchTerm;

    // Convert searchTerm to snake case using Lodash
    searchTerm = _.snakeCase(searchTerm);

    console.log({ searchTerm });

    try {
      const entities = await strapi
        .query("orders")
        .find({ _limit: 1000, _sort: "orderNum:DESC" });

      console.log({ length: entities.length });

      const filteredOrders = entities?.filter((order) => {
        // Assuming 'part_list' is an array in your order entity
        return order?.part_list?.some((part) => {
          // Convert part names to snake case and check if they include the search term
          return (
            _.snakeCase(part?.design?.NAME).includes(searchTerm) ||
            _.snakeCase(part?.panel?.NAME).includes(searchTerm) ||
            _.snakeCase(part?.profile?.NAME).includes(searchTerm) ||
            _.snakeCase(part?.edge?.NAME).includes(searchTerm) ||
            _.snakeCase(part?.applied_profile?.NAME).includes(searchTerm) ||
            _.snakeCase(part?.woodtype?.NAME).includes(searchTerm)
          );
          // Add more fields as needed
        });
      });

      console.log({ filteredOrders: filteredOrders.length });

      return filteredOrders;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
