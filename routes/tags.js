let express = require("express");
let router = express.Router();
let User = require("../models/user");
let Article = require("../models/article");

router.get("/", async (req, res, next) => {
  try {
    
    var distinctTags = await Article.find({}).distinct("tagList");

    res.json({ success: true, distinctTags });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
