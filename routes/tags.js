let express = require("express");
let router = express.Router();
let User = require("../models/user");
let Article = require("../models/article");

router.get("/", async (req, res, next) => {
  try {
    var articles = await Article.find(
      { tagList: { $in: req.body.tagList } },
      { new: true }
    );

    let article = articles.map((article) => article);

    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
