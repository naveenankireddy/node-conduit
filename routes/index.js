var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");

var userController = require("../controller/users");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Register user
router.post("/users", userController.registerUsers);

// Login user
router.post("/users/login", userController.loginUsers);

// get user
router.get("/user", auth.verifyToken, userController.getUser);

// Update user
router.put("/user", auth.verifyToken, userController.updateUser);


// tag 
router.get("/tags", userController.getTags)
module.exports = router;
