var express = require("express");
var router = express.Router();
let auth = require("../middlewares/auth");
let User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Get current user.
router.get("/api/user", auth.verifyToken, async (req, res, next) => {
  console.log(req.userId, "getting user");
  try {
    let user = await User.findById(req.user.userId);
    res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        token: req.user.token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get profile.
router.get("/api/profiles/:username", async (req, res, next) => {
  let user = await User.findOne({ username: req.params.username });
  res.json({ success: true, username: user.username });
});

// Follow
router.post(
  "/api/profiles/:username/follow",
  auth.verifyToken,
  async (req, res, next) => {
    try {
      let followedUser = await User.findOneAndUpdate(
        { username: req.params.username },
        {
          $addToSet: { followers: req.user.userId },
        },
        { new: true }
      );

      let currentUser = await User.findByIdAndUpdate(
        req.user.userId,
        {
          $addToSet: { following: followedUser.id },
        },
        { new: true }
      );
      res.json({ success: true, followedUsercurrentUser });
      
    } catch (error) {
      res.json({ success: false, error });
    }
  }
);

// Unfollow user.
router.delete(
  "/api/profiles/:username/follow",
  auth.verifyToken,
  async (req, res, next) => {
    try {
     let followedUser = await User.findOneAndUpdate(
       { username: req.params.username },
       {
         $pull: { followers: req.user.userId },
       },
       { new: true }
     );

     let currentUser = await User.findByIdAndUpdate(
       req.user.userId,
       {
         $pull: { following: followedUser.id },
       },
       { new: true }
     );
     res.json({ success: true, followedUser });
      
      
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
