var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth")

var commentController = require("../controller/comment")

// create comment 
router.post("/:slug/comments", auth.verifyToken, commentController.createComment)

// get comment
router.get("/:slug/comments", auth.verifyToken, commentController.getComments)

// delete commit 
router.delete("/:slug/comments/:id", auth.verifyToken, commentController.deleteComment)

module.exports = router;