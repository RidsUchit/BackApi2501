const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");

// async function getPosts(userId,offset) {
//     try {

//         let pool = await sql.connect(config);
//         let result = await pool.request()
//             .input("start", sql.Int, offset)
//             .input("length", sql.Int, 10)
//             .input("userId", sql.BigInt, userId)
//             .input("isOwner", sql.Int, 1)
//             .execute("sp_GetPostList");
//             console.log(result.recordset)
//         return result.recordset;

//     }
//     catch (error) {
//         console.error(error);
//         response.status(500).send("Internal Server Error");
//         return [];
//     }
//     finally {
//         // Close the database connection
//         sql.close();
//         //cleanupResources();
//     }
// }
async function getPosts(userId, offset) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("start", sql.Int, offset)
      .input("length", sql.Int, 10)
      .input("userId", sql.BigInt, userId)
      .input("isOwner", sql.Int, 0)
      .execute("sp_GetPostList");
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

async function getPostDetail(postId) {
  /* try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input("input_parameter", sql.Int, productId)
            .query("select * from production.products where product_id=@input_parameter");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    } */
}

module.exports = {
  getPosts: getPosts,
  getPostDetail: getPostDetail,
};
