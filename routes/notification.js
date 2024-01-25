const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const devices = require("../controllers/devices");
// Initialize an array to store tokens
const fcmTokens = [];

async function processTokens() {
  try {
    const deviceTokens = await devices.getDeviceTokenList();
    fcmTokens.splice(0, fcmTokens.length); // Clear the array
    const tokenValues = deviceTokens.map((token) => token.DeviceToken);
    fcmTokens.push(...tokenValues); // Add new token values
    console.log("Tokens 1:", fcmTokens);
    return tokenValues;
  } catch (error) {
    console.error("Error processing tokens:", error);
    throw error; // Re-throw the error for further handling
  }
}

router.post("/sendToAll2", async (request, response) => {
  console.log("notification");

  try {
    await processTokens(); // Process tokens

    var notification = {
      title: "Second Notification",
      body: "New broadcast message",
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
      .then(() => {
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

module.exports = router;
