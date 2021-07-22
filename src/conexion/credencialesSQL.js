const config = {
  port: 38912,
  server: "mssql-38863-0.cloudclusters.net",
  user: "kevin",
  password: "Kevinroot7",
  database: "DEPORTE",
  // stream: false,
  options: {
    // tru +stedConnection: true,
    encrypt: true,
    // enableArithAbort: true,
    trustServerCertificate: true,
  },
};
// mssql-38863-0.cloudclusters.net,38912
// 204.2.195.212
module.exports = config;