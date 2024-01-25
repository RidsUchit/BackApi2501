const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");
async function getNotificationList(userId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("UserId", sql.BigInt, userId)
      .execute("sp_GetNotificationList");

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

async function SaveNotification(userId, bodyTitle, bodyMessage) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("NotificationTypeId", sql.Int, 1) // Type =1  for broadcast message
      .input("BaseTypeId", sql.Int, 0) // This Id belongs to it's relavant table ..For Comment it link to comment table , for broadcast it belongs to broadcast table
      .input("UserIdFrom", sql.BigInt, userId)
      .input("UserIdTo", sql.BigInt, 0) //UserIdTo =0 for all user notification , for broadcast message
      .input("MessageTitle", sql.VarChar, bodyTitle) //CommentId 0 for Insert
      .input("MessageBody", sql.VarChar, bodyMessage)

      .output("Result", sql.Int)
      .execute("sp_InsertUpdateNotification");

    return result;
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
  SaveNotification: SaveNotification,
  getNotificationList: getNotificationList,
};
