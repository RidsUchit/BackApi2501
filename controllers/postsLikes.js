const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");
async function getPostLikeList(postId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("postId", sql.BigInt, postId)
      .execute("sp_GetPostLikeList");
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

async function updatePostLike(postId, userId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PostId", sql.Int, postId)
      .input("UserId", sql.Int, userId)
      .output("Result", sql.Int)
      .execute("sp_InsertUpdateLike");

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
  getPostLikeList: getPostLikeList,
  updatePostLike: updatePostLike,
};
