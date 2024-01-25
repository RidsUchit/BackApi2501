const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");

async function getUserDetail(userId) {
  try {
    console.log("userdetail");
    console.log(userId);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("UserId", sql.BigInt, userId)
      .execute("sp_GetUser");
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

async function UserLogin(username, password, devicetoken, deviceType) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("deviceToken", sql.VarChar, devicetoken)
      .input("deviceType", sql.VarChar, deviceType)
      .output("UserId", sql.VarChar)
      .output("RoleId", sql.Int)
      .output("LoginResult", sql.Int)
      .execute("sp_UserLogin");
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
  getUserDetail: getUserDetail,
  UserLogin: UserLogin,
};
