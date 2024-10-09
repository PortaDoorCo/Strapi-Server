"use strict";

module.exports = async () => {
  // Define emitToAllUsers function outside of process.nextTick
  // strapi.emitToAllUsers = (status, order, updatedStatus) => {
  //   if (strapi.io) {
  //     strapi.io.emit(status, order, updatedStatus);
  //   } else {
  //     console.warn("Socket.io not initialized yet. Unable to emit.");
  //   }
  // };

  process.nextTick(async () => {
    const { Server } = require("socket.io");
    const io = new Server(strapi.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    const { createClient } = require("redis");
    const { createAdapter } = require("@socket.io/redis-adapter");

    // Create Redis clients with TLS options
    const pubClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: redis_url.match(/rediss:/) != null,
        rejectUnauthorized: false,
      },
    });

    const subClient = pubClient.duplicate();

    // Handle errors
    pubClient.on("error", (err) =>
      console.error("Redis Pub Client Error", err)
    );
    subClient.on("error", (err) =>
      console.error("Redis Sub Client Error", err)
    );

    // Connect the clients
    await Promise.all([pubClient.connect(), subClient.connect()]);

    // Use the clients in the adapter
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
    // Remove the following line as we've already defined emitToAllUsers
    strapi.emitToAllUsers = (status, order, updatedStatus) =>
      io.emit(status, order, updatedStatus);
  });
};
