"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  process.nextTick(() => {
    const io = require("socket.io")(strapi.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    const redis = require("socket.io-redis");
    const redisAdapter = require("socket.io-redis");
    io.adapter(redisAdapter(process.env.REDIS_URL));

    const users = [];
    let drivers = [];

    console.log("users", users);

    const getDrivers = () => {
      let clients = io.sockets.clients().connected;
      let sockets = Object.values(clients);
      let drivers = sockets.map((s) => s.driver);
      return drivers.filter((i) => i);
    };

    const emitDrivers = () => {
      io.emit("drivers", getDrivers());
    };

    io.on("connection", (socket) => {
      console.log(socket.id);
      socket.user_id = Math.random() * 100000000000000; // not so secure
      users.push(socket); // save the socket to use it later

      socket.on("position", (position) => {
        console.log("position", position);
        socket.driver = position;
        emitDrivers();
      });

      socket.on("disconnect", () => {
        emitDrivers();
        users.forEach((user, i) => {
          // delete saved user when they disconnect
          if (user.user_id === socket.user_id) users.splice(i, 1);
        });
      });
    });
    strapi.io = io;
    // send to all users connected
    strapi.emitToAllUsers = (status, order, updatedStatus) =>
      io.emit(status, order, updatedStatus);
  });
};
