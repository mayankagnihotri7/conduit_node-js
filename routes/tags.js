let express = require("express");
let router = express.Router();
let User = require("../models/user");
let Article = require("../models/article");

router.get("/", async (req, res, next) => {
  try {

    // if (req.body.tagList) {
    //   console.log(req.body, 'taglist here');
    // } else {
    //   res.json({success: false, message: 'Tag doesnt exist'});
    // }
    
    // var articles = await Article.find(
    //   {},"tagList",
    //   { new: true }
    // );

    var distinctTags = await Article.find({}).distinct("tagList")
    // console.log(articles, 'articles here');

    // let allTags = articles.map((article) => article.tagList).flat();

    res.json({ success: true, distinctTags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
