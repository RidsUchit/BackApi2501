const express = require("express");
const router = express.Router();
const cors = require("cors");
const jobs = require("../controllers/jobs");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/joblist
  //get JobList
  router.get("/joblist", async (request, response) => {
    try {
      jobs.getJobList().then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/joblist/193
  //get Job Detail

  router.get("/joblist/:jobid", async (request, response) => {
    try {
      jobs.getJobDetail(request.params.jobid).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/jobquestions/193
  //get Job Detail
  router.get("/jobquestions/:jobid", async (request, response) => {
    try {
      console.log(request.params.jobid);

      jobs.getJobQuestions(request.params.jobid).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/jobapply
  //get Job Apply
  router.post("/jobapply", async (request, response) => {
    const { jobId, username, message } = request.body;
    try {
      console.log(jobId + " " + username + " ++ " + message);

      jobs.applyJob(jobId, username, message).then((result) => {
        const success1 = result.output.Success;
        console.log(success1);
        //response.json(result);
        if (parseInt(success1) === -1) {
          response
            .status(401)
            .json({ success: false, message: "Application Failed" });
        } else {
          response.json({ success: true, Success: success1 });
        }
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
};
