var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");

var articleController = require("../controller/article");

// List of article
router.get("/", articleController.listArticles);

// feed Article
router.get("/feed", auth.verifyToken, articleController.feedArticle)

// create  article
router.post("/", auth.verifyToken, articleController.createArticle);

// get article
router.get("/:slug", articleController.getArticle);

// update article
router.put("/:slug", auth.verifyToken, articleController.updateArticle);

// delete article
router.delete("/:slug", auth.verifyToken, articleController.deleteArticle);

// Favorite Article
router.post(
  "/:slug/favorite",
  auth.verifyToken,
  articleController.favoriteArticle
);

// unfavorite Article
router.delete(
  "/:slug/favorite",
  auth.verifyToken,
  articleController.unfavoriteArticle
);

module.exports = router;
