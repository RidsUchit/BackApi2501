const express = require("express");
const router = express.Router();
const cors = require("cors");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  router.get("/", (req, res) => {
    res.json({
      hello: "hi",
    });
  });

  router.post("/add", (req, res) => {
    res.send("New Record Added");
  });

  router.delete("/", (req, res) => {
    res.send("Record Deleted !!!");
  });

  router.put("/", (req, res) => {
    res.send("Updating Record !!!!");
  });
};
