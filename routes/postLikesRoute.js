const express = require("express");
const router = express.Router();
const cors = require("cors");
const postsLikes = require("../controllers/postsLikes");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api//posts/like/111/1
  // Endpoint to like a post by post ID and user ID
  router.post("/posts/like/:postId/:userId", async (request, response) => {
    try {
      const { postId, userId } = request.params;
      postsLikes.updatePostLike(postId, userId).then((result) => {
        const success1 = result.output.Result;

        //response.json(result);
        if (parseInt(success1) === 0) {
          response.status(401).json({ success: false });
        } else {
          response.json({ success: true });
        }
      });
    } catch (err) {
      response.status(500).send("Server Error");
    }
  });
};
