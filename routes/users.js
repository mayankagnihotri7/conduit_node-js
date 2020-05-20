var express = require('express');
var router = express.Router();
let User = require('../models/user');
let auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Register Form.
router.post('/', async (req,res,next) => {
  try {
   let user = await User.create(req.body.user);

  // Generating token for the user.
   let token = await auth.generateJWT(user);

   let genUser = {
     email: user.email,
     username: user.username,
     token,
     bio: user.bio
   };

  // Sending response back to client.
  res.status(201).json({genUser});

  console.log(token, "token generated.");

  // If token is or cannot be generated.
   if (!token) { return res.status(400).json({success: false, error: 'Token generation failed.'})}
   
  } catch (error) {
    next(error);
  }
})

// Login Form.
router.post('/login', async (req,res,next) => {
  let { email, password } = req.body.user;

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email/Password required." });
  }

  try {

    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({success: false, error: 'Email not registered.'});

    if (!user.verify(password)) return res.status(400).json({success: false, error: 'Password not valid.'});

    let token = await auth.generateJWT(user);

    res.status(201).json({
      email: user.email,
      username: user.username,
      token,
      // bio: user.bio
    });

  } catch (error) {
    next(error);
  }
  
})

module.exports = router;
