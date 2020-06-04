var jwt = require("jsonwebtoken");

exports.generateJWT = async (user) => {
  try {
    var token = await jwt.sign({ userId: user.id }, "thisissecreate");
    return token;
  } catch (error) {
    return error;
  }
};

exports.verifyToken = async (req, res, next) => {
  var token = req.headers.authorization || "";
  try {
    if (token) {
      var payload = await jwt.verify(token, "thisissecreate");
      //   console.log(payload, "payload")
      var user = {
        userId: payload.userId,
        token: token,
      };
      //   console.log(user, "after payload user")
      req.user = user;
      // console.log("user", user);
      return next();
      //   console.log(req.user, "req.user")
    } else {
      res.status(401).json({ success: false, error: "Uautanticate" });
    }
  } catch (error) {
    next(error);
  }
};
