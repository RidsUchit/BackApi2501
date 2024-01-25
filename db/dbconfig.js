const sql = require("mssql");

const config = {
  user: "admin",
  password: "Biz#Cal$2022",
  server: "imenca.c0ecn0ih86sl.ap-southeast-1.rds.amazonaws.com",
  database: "fci",
  options: {
    //encrypt: true, // if using Azure, set to true
    trustedConnection: true,
    trustServerCertificate: true,
  },
  port: 1433,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.log("Database Connection Failed! Bad Config: ", err);
  });

module.exports = {
  sql,
  poolPromise,
};

// const config = {
//   user: "admin",
//   password: "Biz#Cal$2022",
//   server: "imenca.c0ecn0ih86sl.ap-southeast-1.rds.amazonaws.com",
//   database: "fci",
//   options: {
//     encrypt: true, // if using Azure, set to true
//     //instanceName: 'RIDDHI',
//     //enableArithAbort: true
//     trustedConnection: true,
//     trustServerCertificate: true,
//   },
//   port: 1433,
// };
// module.exports = config;
