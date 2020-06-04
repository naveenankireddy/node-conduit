var User = require("../models/users");

// get profiel
exports.getProfile = async (req, res, next) => {
  try {
    var user = await User.findOne({ name: req.params.name });
    res.json({
      name: user.name,
      bio: user.bio,
      image: user.image,
      following: user.followers.includes(req.user.userId),
    });
  } catch (error) {
    next(error);
  }
};

// follow
exports.followUser = async (req, res, next) => {
  try {
    var user = await User.findOneAndUpdate(
      { name: req.params.name },
      { $addToSet: { followers: req.user.userId } },
      { new: true }
    );
    var currentUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { following: user.id } },
      { new: true }
    );
    var profile = {
      profile: {
        name: user.name,
        bio: user.bio,
        image: user.image,
        following: user.followers.includes(currentUser.id),
      },
    };
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// unfollow
exports.unfollowUser = async (req, res, next) => {
  try {
    var user = await User.findOneAndUpdate(
      { name: req.params.name },
      { $pull: { followers: req.user.userId } },
      { new: true }
    );
    var currentUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { following: user.id } },
      { new: true }
    );
    var profile = {
      profile: {
        name: user.name,
        bio: user.bio,
        image: user.image,
        following: user.followers.includes(currentUser.id),
      },
    };
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
