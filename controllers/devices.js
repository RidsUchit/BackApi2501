const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");
//const { fcmTokens } = require("./fcmToken");
//For getting all device token

async function getDeviceTokenList() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("start", sql.Int, 0)
      .input("length", sql.Int, 10)
      .input("option", sql.Int, 2)
      .execute("sp_GetDeviceToken");
    //  fcmTokens.push(...result.recordset);
    return result.recordset;
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
    return [];
  } finally {
    // Close the database connection
    sql.close();
    //cleanupResources();
  }
}

module.exports = {
  getDeviceTokenList: getDeviceTokenList,
};
