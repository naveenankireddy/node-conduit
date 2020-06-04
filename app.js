var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/jwt-auth",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    console.log("connected", err ? err : true);
  }
);

var indexRouter = require("./routes/index");
var profielRouter = require("./routes/profile");
var articleRouter = require("./routes/article")
var commentRouter = require("./routes/comments")


var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/profiles", profielRouter);
app.use("/api/articles", articleRouter)
app.use("/api/articles", commentRouter)

module.exports = app;
