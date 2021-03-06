var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	name: String,
	username: String,
    phone_number: String,
    referrerID : String,
    referalID: String,
    user_chat_id: String,
    referals: { type: Number, default : 0 },
    balance : { type: Number, default : 0 },
    status : { type: Boolean,default: false }
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User",userSchema);

module.exports = User;