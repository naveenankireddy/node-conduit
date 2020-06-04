var mongoose = require("mongoose");

var Schema = mongoose.Schema

var commentSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    body: String 
})

module.exports = mongoose.model("Comment", commentSchema)