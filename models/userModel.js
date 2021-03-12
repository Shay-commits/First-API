var mongoose = require('mongoose');

var Schema = mongoose.Schema

var UserSchema = new Schema({

  username: String,
  password: String,
  status: {type: String, enum: ["regular", "admin"], default: "regular"}
})



UserSchema
.virtual('url')
.get(function() {
  return '/user/' + this._id
});


module.exports = mongoose.model('User',UserSchema);
