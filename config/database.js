// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "mongoose",
//       settings: {
//         host: env("DATABASE_HOST", "127.0.0.1"),
//         srv: env.bool("DATABASE_SRV", false),
//         port: env.int("DATABASE_PORT", 27017),
//         database: env("DATABASE_NAME", "portadoor"),
//         username: env("DATABASE_USERNAME", ""),
//         password: env("DATABASE_PASSWORD", ""),
//       },
//       options: {
//         authenticationDatabase: env("AUTHENTICATION_DATABASE", null),
//         ssl: env.bool("DATABASE_SSL", false),
//       },
//     },
//   },
// });

module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST"),
        port: env.int("DATABASE_PORT"),
        database: env("DATABASE_NAME"),
        username: env("DATABASE_USERNAME"),
        password: env("DATABASE_PASSWORD"),
        schema: env("DATABASE_SCHEMA", "public"),
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      },
      options: {},
    },
  },
});

// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "bookshelf",
//       settings: {
//         uri: env("DATABASE_URI"),
//         schema: env("DATABASE_SCHEMA", "public"),
//         ssl: {
//           rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
//         },
//       },
//       options: {

//       },
//     },
//   },
// });
