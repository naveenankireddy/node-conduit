var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");
var profileController = require("../controller/profile");

// Get Profile
router.get("/:name", auth.verifyToken, profileController.getProfile);

// Follow User
router.post("/:name/follow", auth.verifyToken, profileController.followUser);

// Unfollow User
router.delete(
  "/:name/follow",
  auth.verifyToken,
  profileController.unfollowUser
);
module.exports = router;
