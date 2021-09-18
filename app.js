var dotenv = require('dotenv').config();
var TelegramBot = require('node-telegram-bot-api');
var token = process.env.TELEGRAM_HTTP_TOKEN;
var bot = new TelegramBot(token, {
    polling: true
});
var cron = require('node-cron');
var request = require('request');
var express = require("express");
var emoji = require('node-emoji').emoji;
var mongoose = require("mongoose");
var User = require("./models/user");
var cu = require("./middlewares/checkUser");
var bodyParser = require("body-parser");
var crypto = require("crypto-random-string");
var app = express();
var port = process.env.PORT || 3000;
var mongoDbStr;
if (port !== 3000) {
    mongoDbStr = process.env.MOGNODB_URI;

} else {
    mongoDbStr = "mongodb://localhost:27017/sub_to_earn";
}

console.log(mongoDbStr)
mongoose.connect(mongoDbStr, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get("/", function(req, res) {
    res.json(users);
})


var previousMessage;
var userControlKeyBoard = {
    "parse_mode": "Markdown",
    "reply_markup": {
        "keyboard": [
            [{
                text: `Balance ${emoji.moneybag}`
            }],
            [{
                text: 'Status'
            }],
            [{
                text: `Referals ${emoji.rocket} ${emoji.rocket}`
            }]

        ]
    }
}

User.find([])

let users = [];
var ref = [21344, 32432, 32432, 56445, 43546, 67545, 35452]

bot.onText(/\/start/, (msg) => {

    var chatId = msg.chat.id;
    var referrerID = msg.text.slice(7, 15);
    var referalID = "rf" + crypto(6).toString('hex');
    bot.sendMessage(chatId, `hi ${emoji.heart}`)
    console.log(referalID);
    var user = {
        name: msg.from.first_name + msg.from.last_name,
        username: msg.from.username,
        tele_user_id: msg.from.id
    }

    User.find(user, function(err, user) {
        if (user.length === 0) {
            var option = {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "one_time_keyboard": true,
                    "keyboard": [
                        [{
                            text: "Give number",
                            request_contact: true
                        }],
                        ["Cancel"]
                    ]
                }
            };

            console.log(user)
            bot.sendMessage(chatId, 'Welcome to our family. Follow the instractions to complete registraion')
                .then(function() {
                    bot.sendMessage(chatId, "Give us your number", option)
                        .then(function(sended) {
                            var chatId = sended.chat.id;
                            var messageId = sended.message_id;
                            previousMessage = sended.text;
                            bot.onReplyToMessage(chatId, messageId, function(message) {



                                if (message.contact.phone_number) {


                                    var tempUser = {
                                        name: message.from.first_name + message.from.last_name,
                                        username: message.from.username,
                                        tele_user_id: message.from.id,
                                        phone_number: message.contact.phone_number,
                                        referrerID: referrerID,
                                        referalID: referalID
                                    }

                                    User.create(tempUser, function(err, user) {
                                        if (err) console.log(err);


                                        bot.sendMessage(chatId, "registraion complete")
                                            .then(function() {
                                                bot.sendMessage(sended.chat.id, "Use the commands to control your account", userControlKeyBoard)
                                            })

                                    });

                                } else {
                                    bot.sendMessage(chatId, "Registraion unsuccessfull")
                                }



                            });

                        })

                })
        } else {
            bot.sendMessage(chatId, "Welcome back")
                .then(function(sended) {
                    bot.sendMessage(sended.chat.id, "Use the commands to control your account", userControlKeyBoard)
                })
        }
    })



})



bot.on('message', function(msg) {

    var chatId = msg.chat.id;
    /*
        if (msg.text.indexOf("YES") === 0) {

            bot.sendMessage(msg.chat.id, "Good to here");

        } else if (msg.text.indexOf("NO") === 0) {

            bot.sendMessage(msg.chat.id, "Sounds bad");

        }

        if (msg.text.indexOf("antor") === 0) {

            bot.sendMessage(msg.chat.id, "antor kemon asis..?");

        }*/

    if (msg.text === 'Balance 💰') {
        // console.log(msg)
        (async function() {
            var tempUser = {
                name: msg.from.first_name + msg.from.last_name,
                username: msg.from.username,
                tele_user_id: msg.from.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {


                    bot.sendMessage(chatId, `You Balance is ${ user[0].balance}`);

                } else {
                    bot.sendMessage(chatId, `${emoji.x}`);
                }
            })
        })()



    }
    if (msg.text === 'Status') {

        (async function() {
            var tempUser = {
                name: msg.from.first_name + msg.from.last_name,
                username: msg.from.username,
                tele_user_id: msg.from.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {
                    var status = "Inactive"
                    if (user[0].status) {
                        status = 'Active'
                    }

                    bot.sendMessage(chatId, `Your Account  is ${status}`);

                } else {
                    bot.sendMessage(chatId, `${emoji.x}`);
                }
            })
        })()


    }
    if (msg.text === 'Referals 🚀 🚀') {
        (async function() {
            var tempUser = {
                name: msg.from.first_name + msg.from.last_name,
                username: msg.from.username,
                tele_user_id: msg.from.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {

                    bot.sendMessage(chatId, `You have ${ user[0].referals} referals`);

                } else {
                    bot.sendMessage(chatId, `${emoji.x}`);
                    bot.sendMessage(chatId, "type /start first")
                }
            })
        })()

    }

    if (msg.text === "Cancel" && previousMessage === "Give us your number") {

        var tempUser = {
            name: msg.from.first_name + msg.from.last_name,
            username: msg.from.username,
            tele_user_id: msg.from.id
        }

        User.find(tempUser, function(err, user) {
            if (user.length !== 0) {

                bot.sendMessage(chatId, `unknown command`);

            } else {
                previousMessage = '';
                bot.sendMessage(chatId, `${emoji.x}`);
                bot.sendMessage(chatId, "Without phone number you can't register");
                bot.sendMessage(chatId, "type /start first to start the bot again")
            }
        })



    }




})


bot.on("callback_query", (callbackQuery) => {


});



bot.on("polling_error", (err) => console.log(err));

// zvDKJ54987



cron.schedule('*/10 * * * *', function() {


request('https://enigmatic-river-45127.herokuapp.com/', function (error, response, body) {

  console.log('body:', body); 
});

});