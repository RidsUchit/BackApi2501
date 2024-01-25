const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const cors = require("cors");
const devices = require("../controllers/devices");
const notifications = require("../controllers/notification");
// Initialize an array to store tokens
const fcmTokens = [];

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  async function processTokens() {
    try {
      const deviceTokens = await devices.getDeviceTokenList();
      fcmTokens.splice(0, fcmTokens.length); // Clear the array
      const tokenValues = deviceTokens.map((token) => token.DeviceToken);
      // fcmTokens.push(...tokenValues); // Add new token values

      const uniqueTokens = [...new Set(tokenValues)]; // Use Set to remove duplicates
      fcmTokens.push(...uniqueTokens);
      console.log("Tokens 1:", fcmTokens);
      return tokenValues;
    } catch (error) {
      console.error("Error processing tokens:", error);
      throw error; // Re-throw the error for further handling
    }
  }

  // https://fcbackapi.netlify.app/.netlify/functions/api/sendToAll
  //http://localhost:5500/.netlify/functions/api/sendToAll
  //send notification to all Broadcast message

  router.post("/sendToAll", async (request, response) => {
    const { userId, bodyTitle, bodyMessage } = request.body;
    console.log("notification");

    try {
      await processTokens(); // Process tokens

      var notification = {
        title: bodyTitle,
        body: bodyMessage,
      };

      var notification_body = {
        notification: notification,
        registration_ids: fcmTokens,
      };

      fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization:
            "key=" +
            "AAAAgDcm4jU:APA91bGBTsD592vOvWWuup1xLRsACl3S59mz-QmIdJEbmYe0H3GPBkOiDwLjVXyY9NV66VYZtM85ClZ8hfdF3Zso4mpWr79In0tZOcUgdWl_kdpH54iIYUKQo6pXzZLrzQSgcriUVlw3",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification_body),
      })
        .then(async () => {
          await notifications.SaveNotification(userId, bodyTitle, bodyMessage); // Process tokens
          response.status(200).send("Notification Send Successfully");
        })
        .catch((err) => {
          response.status(400).send("Something went wrong");
          console.log(err);
        });
    } catch (error) {
      console.error("Error sending notification:", error);
      response.status(500).send("Internal Server Error");
    }
  });

  // https://fcbackapi.netlify.app/.netlify/functions/api/notificationList
  //http://localhost:5500/.netlify/functions/api/notificationList
  //Get all notificationList

  router.get("/notificationList/:userId", async (request, response) => {
    try {
      console.log("Notification List");
      console.log(request.params.userId);

      notifications
        .getNotificationList(request.params.userId)
        .then((result) => {
          response.json(result);
        });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
};
