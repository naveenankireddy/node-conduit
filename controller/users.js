var User = require("../models/users");
var auth = require("../middleware/auth");
var Article = require("../models/article")


// register user
exports.registerUsers = async (req, res, next) => {
  try {
    var user = await User.create(req.body.user);
    var token = await auth.generateJWT(user);
    res.status(201).json({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// login user
exports.loginUsers = async function (req, res, next) {
  var { email, password } = req.body.user;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      error: "Eamil/Password required",
    });
  try {
    var user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, error: "Invalid Eamil" });
    if (!user.verifyPassword(password))
      return res
        .status(400)
        .json({ success: false, error: "Invalid Password" });

    var token = await auth.generateJWT(user);
    res.status(201).json({
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// get user
exports.getUser = async (req, res, next) => {
  try {
    var user = await User.findById(req.user.userId);
    res.json({
      user: {
        email: user.email,
        name: user.name,
        token: req.user.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update user
exports.updateUser = async (req, res, next) => {
  try {
    var user = await User.findByIdAndUpdate(req.user.userId, req.body.user, {
      new: true,
    });
    res.json({
      user: {
        email: user.email,
        name: user.name,
        token: req.user.token,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};


// tags
exports.getTags = async ( req, res, next) => {
  console.log("tags id")
  try {
    let tags= await Article.distinct('tagList')
    res.json({tags})
  } catch (error) {
    next(error)
  }
}