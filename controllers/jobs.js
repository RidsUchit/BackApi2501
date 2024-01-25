const { response } = require("express");
const { poolPromise, sql } = require("../db/dbconfig");

//ForJob List
async function getJobList() {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("start", sql.Int, 0)
      .input("length", sql.Int, 10)
      .execute("sp_GetJobListForSite");
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

//For Job Detail
async function getJobDetail(JobId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("JobDetailId", sql.Int, JobId)
      .execute("sp_GetJobDetail");
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

//For Job Questions
async function getJobQuestions(JobId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("JobDetailId", sql.Int, JobId)
      .execute("sp_GetJobQuestions");
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

async function applyJob(jobId, username, message) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Username", sql.VarChar, username)
      .input("jobId", sql.VarChar, jobId)
      .input("message", sql.VarChar, message)
      .output("Success", sql.Int)
      .execute("sp_ApplyJob");
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
  getJobList: getJobList,
  getJobDetail: getJobDetail,
  getJobQuestions: getJobQuestions,
  applyJob: applyJob,
};
