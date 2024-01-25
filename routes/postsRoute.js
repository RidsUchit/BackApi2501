const express = require("express");
const router = express.Router();
const cors = require("cors");
const posts = require("../controllers/posts");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/posts/1?page=2&pageSize=10
  //get post list pagewise -- on scroll
  router.get("/posts/:userId", async (request, response) => {
    try {
      console.log(request.query);
      const { page, pageSize } = request.query;
      const offset = (page - 1) * pageSize;
      console.log(`Page ${page} Pagesize ${pageSize} Offset ${offset}`);

      posts.getPosts(request.params.userId, offset).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });
};
