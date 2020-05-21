let express = require("express");
let router = express.Router();
let auth = require("../middlewares/auth");
let Article = require("../models/article");
let User = require("../models/user");
let slug = require('slug');

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

    console.log(req.body.article.title, 'pre-update.');
    
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

    return next (error);

  }

});

module.exports = router;
