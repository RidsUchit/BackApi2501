const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");

async function getUserRewardDetail(userId) {
  try {
    const countryId = 217;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("countryId", sql.Int, countryId)
      .execute("Rewards.sp_GetUserRewardDetail");
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
  getUserRewardDetail: getUserRewardDetail,
};
