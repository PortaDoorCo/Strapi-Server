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
    (async () => {
      const io = require("socket.io")(strapi.server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      const { createClient } = require("redis");
      const { createAdapter } = require("@socket.io/redis-adapter");

      const redis_url = process.env.REDIS_URL;

      // Create the Redis clients for pub/sub with TLS
      const pubClient = createClient({
        url: redis_url,
        socket: {
          tls: redis_url.match(/rediss:/) != null,
          rejectUnauthorized: false,
        },
      });

      const subClient = pubClient.duplicate();

      // Connect the Redis clients
      await pubClient.connect();
      await subClient.connect();

      // Handle Redis errors
      pubClient.on("error", (err) =>
        console.error("Redis Pub Client Error", err)
      );
      subClient.on("error", (err) =>
        console.error("Redis Sub Client Error", err)
      );

      // Use the Redis adapter with Socket.IO
      io.adapter(createAdapter(pubClient, subClient));

      const users = [];
      let drivers = [];

      console.log("users", users);

      const getDrivers = () => {
        let clients = io.sockets.sockets;
        let sockets = Array.from(clients.values());
        let drivers = sockets.map((s) => s.driver).filter(Boolean);
        return drivers;
      };

      const emitDrivers = () => {
        io.emit("drivers", getDrivers());
      };

      io.on("connection", (socket) => {
        socket.user_id = Math.random() * 100000000000000; // Not secure, consider using a proper ID generator
        users.push(socket); // Save the socket for later use

        socket.on("position", (position) => {
          socket.driver = position;
          emitDrivers();
        });

        socket.on("disconnect", () => {
          emitDrivers();
          users.forEach((user, i) => {
            if (user.user_id === socket.user_id) users.splice(i, 1);
          });
        });
      });

      strapi.io = io;

      // Function to emit events to all connected users
      strapi.emitToAllUsers = (status, order, updatedStatus) => {
        io.emit(status, order, updatedStatus);
      };
    })();
  });
};
