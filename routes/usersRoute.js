const express = require("express");
const router = express.Router();
const cors = require("cors");
const users = require("../controllers/users");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/profile/1
  //get User Profile
  router.get("/profile/:userId", async (request, response) => {
    try {
      console.log("profile");

      console.log(request.params.userId);

      users.getUserDetail(request.params.userId).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/login
  // https://fcbackapi.netlify.app/.netlify/functions/api/login
  //get User login

  router.post("/login", async (request, response) => {
    const { username, password, devicetoken, deviceType } = request.body;
    try {
      console.log(
        username + " ++ " + password + " + " + devicetoken + " + " + deviceType
      );

      users
        .UserLogin(username, password, devicetoken, deviceType)
        .then((result) => {
          const loginResult = result.output.LoginResult;

          console.log(loginResult);

          //response.json(result);
          if (parseInt(loginResult) === 0) {
            response
              .status(401)
              .json({ success: false, message: "Invalid credentials" });
          } else {
            const userId = result.output.UserId;
            const roleId = result.output.RoleId;
            response.json({ success: true, UserId: userId, RoleId: roleId });
          }
        });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
};
