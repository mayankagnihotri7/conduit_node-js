let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let slug = require("slug");

let articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
    },
    tagList: [String],
    favorited: [String],
    favoriteCount: Number,
    comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  if (this.title && this.isModified("title")) {
    let slugged = slug(this.title, { lower: true });
    this.slug = slugged //+ Date.now();
    next();
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
