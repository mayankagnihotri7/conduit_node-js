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
      // Searching for user to follow.
      let followUser = await User.findOne({ username: req.params.username });

      // If user is not found.
      if (!followUser)
        return res.json({ success: false, message: "User Not Found!" });

      let findUser = await User.findById(req.user.userId);

      console.log(findUser);

      // If the searched user is not included in the following array/list.
      if (!findUser.following.includes(followUser.username)) {
        let currentUser = await User.findByIdAndUpdate(
          req.user.userId,
          {
            $push: { following: followUser.username },
          },
          { new: true }
        );
        console.log(currentUser, "current user here");
        res.json({ success: true, currentUser });
        // res.json({
        //   profile: {
        //     username: followUser.username,
        //     bio: followUser.bio,
        //     image: followUser.image,
        //     following: followUser.follower.includes(currentUser.username),
        //   },
        // });
      } else if (
        findUser.username !== followUser.username ||
        followUser.username !== findUser.username
      ) {
        res.json({ success: false, message: "Cannot follow own account." });
      } else {
        // If the user is already following the searched user.
        res.json({
          success: false,
          message: `Already following ${followUser.username} `,
        });
      }

      // let followerUser = await User.findOneAndUpdate(
      //   { username: req.params.username },
      //   {
      //     $push: { follower: currentUser.username },
      //   },
      //   { new: true }
      // );
      // console.log(followerUser, "follower user.");
      
      res.json({
        profile: {
          username: followerUser.username,
          bio: followerUser.bio,
          image: followerUser.image,
          following: followerUser.follower.includes(currentUser.username),
        },
      });

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
      // Searching for the user to unfollow.
      let unfollowUser = await User.findOne({ username: req.params.username });
      console.log(unfollowUser, "this is unfollow.");

      let findUser = await User.findById(req.user.userId);

      // If user is not found.
      if (!unfollowUser)
        return res.json({ success: false, message: "User not found." });

      if (findUser.following.includes(unfollowUser.username)) {
        let currentUser = await User.findByIdAndUpdate(
          req.user.userId,
          { $pull: { following: unfollowUser.username } },
          { new: true }
        );
        console.log(currentUser, "user unfollowed.");
        res.json({ success: true, message: "user unfollowed successfully." });
      } else {
        res.json({ success: false, message: "Already unfollowed." });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
