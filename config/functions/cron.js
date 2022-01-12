"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  "0 * * * *": async () => {
    const x = await strapi.query("orders").find({
      _sort: "id:desc",
      _limit: 100,
      dueDate_lte: new Date(),
      Shipping_Scheduled: true,
    });

    const y = await strapi.query("orders").find({
      _sort: "id:desc",
      _limit: 100,
      dueDate_lte: new Date(),
      Shipping_Scheduled: false || null,
    });

    console.log("Fire!");
    console.log(x.length);
    console.log(y.length);

    x.forEach(async (order) => {
      await strapi.api.orders.services.orders.update(
        { id: order.id },
        { late: true }
      );
    });

    y.forEach(async (order) => {
      await strapi.api.orders.services.orders.update(
        { id: order.id },
        { late: false }
      );
    });
  },
};
