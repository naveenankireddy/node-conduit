var slug = require("slug");
var Article = require("../models/article");
var User = require("../models/users");

// list of article
exports.listArticles = async (req, res, next) => {
  try {
    if (req.query.author) {
      var user = await User.findOne({ name: req.query.author });
      var article = await Article.find({ author: user.id }).populate({
        path: "author",
        select: "name bio",
      });
      res.json({ article });
    } else if (req.query.favorited) {
      var user = await User.findOne({ name: req.query.favorited });
      var article = await Article.find({ favorited: user.id }).populate({
        path: "author",
        select: "name bio",
      });
      res.json({ article });
    } else if (req.query.tags) {
      var user = await User.findOne({ tagList: req.query.tagList });
      var article = await Article.find({ tagList: user.id }).populate({
        path: "author",
        select: "name bio image following",
      });
      res.json({ article });
    } else if (req.query.limit) {
      var article = await Article.find({})
        .populate({ path: "author", select: "name bio image following " })
        .limit(Number(req.query.limit))
        .exec();
      res.json({ article });
    } else {
      var article = await Article.find({}).populate({
        path: "author",
        select: "name bio image following:followers.includes(article.id)",
      });
      res.json({ article });
    }
  } catch (error) {
    next(error);
  }
};

// feed Article
exports.feedArticle = async (req, res, next) => {
  try {
    var user = await User.findById(req.user.userId);
    var article = await Article.find({ author: { $in: user.following } });
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

// create article
exports.createArticle = async (req, res, next) => {
  try {
    req.body.article.author = req.user.userId;
    console.log(req.body.article);
    var article = await Article.create(req.body.article);

    var user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { articles: article.id } },
      { new: true }
    );
    res.json({
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        slug: article.slug,
      },
    });
  } catch (error) {
    next(error);
  }
};

// get article
exports.getArticle = async (req, res, next) => {
  try {
    var article = await Article.findOne({ slug: req.params.slug }).populate({
      path: "author",
      select: "name bio image following:followers.includes(article.id)",
    });
    res.json({ article });
  } catch (error) {
    next(error);
  }
};

// update article
exports.updateArticle = async (req, res, next) => {
  console.log(req.params.slug);
  try {
    req.body.article.slug = slug(req.body.article.title, { lower: true });
    var updateArticle = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body.article,
      { new: true }
    );
    res.json({ updateArticle });
  } catch (error) {
    next(error);
  }
};

// delete article
exports.deleteArticle = async (req, res, next) => {
  console.log(req.params.slug);
  try {
    var deleteArticle = await Article.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json({ success: "article deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// faviroate article
exports.favoriteArticle = async (req, res, next) => {
  try {
    var id = req.user.userId;
    var article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $addToSet: { favorited: id } },
      { $inc: { favoriteCount: 1 } }
    ).populate({
      path: "author",
      select: "name bio image following:followers.includes(article.id)",
    });

    var currentUser = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { favorited: article.id },
      },
      { new: true }
    );

    var articles = {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        favorited: article.favorited.includes(currentUser.id),
        favoriteCount: article.favoriteCount,
        author: article.author,
      },
    };
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

// Unfavorite Article
exports.unfavoriteArticle = async (req, res, next) => {
  try {
    var id = req.user.userId;
    var article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $pull: { favorited: id } },
      { $inc: { favoriteCount: -1 } }
    ).populate({
      path: "author",
      select: "name bio image following:followers.includes(article.id)",
    });

    var currentUser = await User.findByIdAndUpdate(
      id,
      {
        $pull: { favorited: article.id },
      },
      { new: true }
    );

    var articles = {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        favorited: article.favorited.includes(currentUser.id),
        favoriteCount: article.favoriteCount,
        author: article.author,
      },
    };
    res.json(articles);
  } catch (error) {
    next(error);
  }
};
