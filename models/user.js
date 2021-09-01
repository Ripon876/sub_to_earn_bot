var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name: String,
	username: String,
    tele_user_id: String,
    phone_number: String,
    referrerID : String,
    referalID: String,
    referals: { type: Number, default : 0 },
    balance : { type: Number, default : 0 },
    status : { type: Boolean,default: true }
});
var User = mongoose.model("User",userSchema);

module.exports = User;