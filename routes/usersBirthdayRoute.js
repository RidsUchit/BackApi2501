const express = require("express");
const router = express.Router();
const cors = require("cors");
const users = require("../controllers/userBirthdays");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/upcomingbirthdays
  //get Upcoming Birthdays in next 30 Days
  router.get("/upcomingbirthdays", async (request, response) => {
    try {
      users.getUsersUpcomingBirthdays().then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/todaybirthday
  //get Today's Birthday
  router.get("/todaybirthday", async (request, response) => {
    try {
      users.getUsersTodaysBirthdays().then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
};
