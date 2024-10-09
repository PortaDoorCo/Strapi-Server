"use strict";

module.exports = async () => {
  process.nextTick(async () => {
    const io = require("socket.io")(strapi.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    const { createClient } = require("redis");
    const redisAdapter = require("socket.io-redis");

    const redis_url = process.env.REDIS_URL;
    // Create Redis clients with TLS options
    const pubClient = createClient({
      url: process.env.REDIS_URL,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const subClient = pubClient.duplicate();

    // Handle errors
    pubClient.on("error", (err) => console.error("Redis Client Error", err));
    subClient.on("error", (err) => console.error("Redis Client Error", err));

    // Connect the clients
    await pubClient.connect();
    await subClient.connect();

    // Use the clients in the adapter
    io.adapter(redisAdapter({ pubClient, subClient }));

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
      socket.user_id = Math.random() * 100000000000000; // not so secure
      users.push(socket); // save the socket to use it later

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
    // Send to all users connected
    strapi.emitToAllUsers = (status, order, updatedStatus) =>
      io.emit(status, order, updatedStatus);
  });
};
