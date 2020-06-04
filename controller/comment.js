var slug = require("slug");
var Article = require("../models/article");
var User = require("../models/users");
var Comment = require("../models/comments");

// create comments
exports.createComment = async (req, res, next) => {
  try {
    req.body.comment.author = req.user.userId;
    console.log(req.body.comment);
    var comment = await (await Comment.create(req.body.comment))
      .populate("author", "name bio image following")
      .execPopulate();
    var article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $addToSet: { comments: comment.id } },
      { new: true }
    );
    res.json({
      comment: {
        author: comment.author,
        body: comment.body,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get comments
exports.getComments = async (req, res, next) => {
  try {
    var article = await (await Article.findOne({ slug: req.params.slug }))
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name bio",
          model: "User",
        },
      })
      .execPopulate();
    // console.log(article.comments[0].author, "----------");
    res.json(article.comments);
  } catch (error) {
    next(error);
  }
};

// delete comments
exports.deleteComment = async (req, res, next) => {
  try {
    console.log(req.params.id)
    console.log(req.params.slug)
    var deleteComment = await Comment.findByIdAndDelete(req.params.id);
    var article = await Article.findOneAndUpdate(req.params.slug, {
      $pull: { comments: deleteComment.id },
    });
    console.log(deleteComment.id)
    res.json({ success: "comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
