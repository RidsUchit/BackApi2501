const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");
async function getPostCommentList(postId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("postId", sql.BigInt, postId)
      .execute("sp_GetPostCommentList");

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

async function InsertPostComment(postId, userId, comment) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("PostId", sql.Int, postId)
      .input("UserId", sql.Int, userId)
      .input("Comment", sql.VarChar, comment)
      .input("CommentId", sql.BigInt, 0) //CommentId 0 for Insert
      .output("Result", sql.Int)
      .execute("sp_InsertUpdateComment");
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
  getPostCommentList: getPostCommentList,
  InsertPostComment: InsertPostComment,
};
