const generalRoute = require("./generalRoute");
const postRoutes = require("./postsRoute");
const postLikesRoute = require("./postLikesRoute");
const postCommentRoute = require("./postCommentRoute");
const usersRoute = require("./usersRoute");
const usersBirthdays = require("./usersBirthdayRoute");
const usersRewards = require("./usersRewardsRoute");
const jobList = require("./jobListRoute");
const notificationRoute = require("./notificationRoute");

module.exports = function ({ app }) {
  postRoutes({ app });
  postLikesRoute({ app });
  postCommentRoute({ app });
  generalRoute({ app });
  usersRoute({ app });
  usersBirthdays({ app });
  usersRewards({ app });
  jobList({ app });
  notificationRoute({ app });
};
