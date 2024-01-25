const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");

//For UcomingBirthday in Next 30 Days
async function getUsersUpcomingBirthdays() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Flag", sql.Int, 0)
      .execute("sp_GetUserBirthDays");
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
//For Today's Birthday
async function getUsersTodaysBirthdays() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Flag", sql.Int, 1)
      .execute("sp_GetUserBirthDays");
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
  getUsersUpcomingBirthdays: getUsersUpcomingBirthdays,
  getUsersTodaysBirthdays: getUsersTodaysBirthdays,
};
