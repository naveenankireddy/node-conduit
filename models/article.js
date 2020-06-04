var mongoose = require("mongoose");
var slug = require("slug");

var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tagList: [
      {
        type: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favorited: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favoriteCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

articleSchema.pre("save", async function (next) {
  try {
    if (this.title) {
      var slugTitle = slug(this.title, { lower: true });
      this.slug = slugTitle + "-" + Date.now();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Article", articleSchema);
