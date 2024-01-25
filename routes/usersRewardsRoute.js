const express = require("express");
const router = express.Router();
const cors = require("cors");
const users = require("../controllers/userRewards");
const userPoint = require("../controllers/pointRedeem");
module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/rewards/1
  //get Rewards Dashboard Details

  router.get("/rewards/:userId", async (request, response) => {
    try {
      users.getUserRewardDetail(request.params.userId).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
  //API URL : http://localhost:5500/.netlify/functions/api/pointlist
  //API URL :  https://fcbackapi.netlify.app/.netlify/functions/api/pointlist
  //get point Redeem List

  router.get("/pointlist", async (request, response) => {
    try {
      userPoint.getPointRedeemList().then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/redeempoint
  //API URL :  https://fcbackapi.netlify.app/.netlify/functions/api/redeempoint
  //get point Redeem List

  router.post("/redeempoint", async (request, response) => {
    try {
      const { userId, point } = request.body;

      userPoint.insertRedeemPoint(userId, point).then((result) => {
        response.json(result);
      });
    } catch (err) {
      response.status(500).send("Server Error");
    }
  });
};
