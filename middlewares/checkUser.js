var mongoose = require("mongoose");
var User = require("../models/user");

module.exports = {
	checkBalance: function(msg) {

		var tempUser = {
			name: msg.from.first_name + msg.from.last_name,
			username: msg.from.username,
			tele_user_id: msg.from.id
		}

		User.find(tempUser,function(err,user) {
			if(user.length !== 0){
				
				 // bot.sendMessage(chatId,`You Balance is ${user.balance}`);
				 return "You Balance is" +  `${user.balance}` ;
			}else {
				return ""



			}
		})
	}
}


// 01824336253
// 01300139945