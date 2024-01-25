const express = require("express");
const router = express.Router();
const cors = require("cors");
const postsComments = require("../controllers/postComments");

module.exports = function ({ app }) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/.netlify/functions/api", router);

  //API URL : http://localhost:5500/.netlify/functions/api/posts/commentlist/111
  //get list of comment on postId
  router.get("/posts/commentlist/:postId", async (request, response) => {
    try {
      const { postId } = request.params;
      postsComments.getPostCommentList(postId).then((result) => {
        response.json(result);
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });

  //API URL : http://localhost:5500/.netlify/functions/api/posts/commentadd
  // https://fcbackapi.netlify.app/.netlify/functions/api/posts/commentadd
  // Endpoint to comment on  a post by post ID and user ID
  router.post("/posts/commentadd", async (request, response) => {
    const { postId, userId, comment } = request.body;
    try {
      console.log("postComment");
      console.log("PostId ", postId);
      console.log("UserId ", userId);

      postsComments
        .InsertPostComment(postId, userId, comment)
        .then((result) => {
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
