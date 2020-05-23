let express = require("express");
let router = express.Router();
let auth = require("../middlewares/auth");
let Article = require("../models/article");
let User = require("../models/user");
let slug = require("slug");
let Comment = require('../models/comment');

// Create article.
router.post("/", auth.verifyToken, async (req, res, next) => {
  console.log(req.body.article, "this is start.");

  try {
    let user = User.findById(req.user.userId);
    req.body.article.author = req.user.userId;

    let article = await Article.create(req.body.article);

    console.log(article, "this is post article.");

    res.json({ success: true, article });
  } catch (error) {
    return next(error);
  }
});

// Feed articles.
router.get("/feed", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    console.log(user);

    let feedArticle = await Article.find({ author: { $in: user.following } })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("author");

    console.log(feedArticle, "this is feed article.");

    res.json({ feedArticle });
  } catch (error) {
    next(error);
  }
});

// List single article.
router.get("/:slug", async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug }).populate(
      "author"
    );

    console.log(article, "article found...");

    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
});

// Update article.
router.put("/:slug", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);

    req.body.article.slug = slug(req.body.article.title, { lower: true });

    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body.article,
      { new: true }
    );

    res.json({ success: true, article });

    console.log(article, "updating article.");
  } catch (error) {
    return next(error);
  }
});

// Delete article.
router.delete("/:slug", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);

    let article = await Article.findOneAndRemove({ slug: req.params.slug });

    console.log(article, "article deleted.");

    if (!article)
      return res
        .status(404)
        .json({ success: false, message: "Article not found." });

    res.json({ success: true, message: "Article deleted successfully." });
  } catch (error) {
    return next(error);
  }
});

// Favorite Article.
router.post("/:slug/favorite", auth.verifyToken, async (req, res, next) => {
  try {
    console.log(req.params.slug, "we are inside favorites.");

    let user = await User.findById(req.user.userId);
    console.log(user, "user found.");

    let userId = user.userId;
    console.log(userId, "ID here!");

    let article = await Article.findOne({ slug: req.params.slug });

    console.log(article, "heyyyyy");

    if (!article.favorited.includes(userId)) {
      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        {
          $addToSet: { favorited: req.user.userId },
        },
        { new: true }
      );

      console.log(req.user.userId, "doing the article.");

      return res.json({ success: true, article });
    } else if (article.favorited.includes(userId)) {
      return res.json({
        success: false,
        message: "Already favorited this one.",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Unfavorite article.
router.delete("/:slug/favorite", auth.verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.userId);
    console.log(user, "inside delete.");

    let userId = req.user.userId;
    console.log(userId, "delete userId");

    let article = await Article.findOne({ slug: req.params.slug });
    console.log(article, "article to be deleted.");

    if (article.favorited.includes(userId)) {
      console.log("inside unfavorite");

      let article = await Article.findOneAndUpdate(
        { slug: req.params.slug },
        { $pull: { favorited: req.user.userId } },
        { new: true }
      );
      console.log(article, "we are unfavorite.");
    } else {
      res.json({ success: false, message: "Already unfavorited it." });
    }
  } catch (error) {
    return next(error);
  }
});

// Add comments to article.
router.post("/:slug/comments", auth.verifyToken, async (req, res, next) => {
  
  try {

    console.log(req.body, "creating comments.");

    let user = await User.findById(req.user.userId);
    console.log(user, 'finding user');

    let article = await Article.findOne({slug: req.params.slug});
    console.log(article, 'article to be commented on.');

  } catch (error) {

    next(error);

  }

});

module.exports = router;
