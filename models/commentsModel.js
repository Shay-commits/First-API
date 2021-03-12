var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({

user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
title: String,
body: String,
post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
timestamp: Date

});



module.exports = mongoose.model('Comment',CommentSchema);
