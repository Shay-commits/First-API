var mongoose = require('mongoose')

var Schema = mongoose.Schema

var PostSchema = new Schema({

title: String,
body: String,
timestamp: Date,
status: {type: String, enum: ["active", "inactive"], default: "inactive"}


})




module.exports = mongoose.model('Post',PostSchema);
