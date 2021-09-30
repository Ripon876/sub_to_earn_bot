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
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var cu = require("./middlewares/middleware");
var bodyParser = require("body-parser");
var crypto = require("crypto-random-string");
var app = express();

var sl = require("./routes/signup-login");

var port = process.env.PORT || 3000;
var mongoDbStr;
if (port !== 3000) {
    mongoDbStr = process.env.MOGNODB_URI;

} else {
    mongoDbStr = "mongodb://localhost:27017/sub_to_earn";
}


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//passport

app.use(require('express-session')({
    secret: "My name is MD Ripon Islam",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

console.log(mongoDbStr)
mongoose.connect(mongoDbStr, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

if (port !== 3000) {
    User.deleteMany({}, function() {
        console.log("db cleared");
    })
}
app.use(bodyParser.json());

app.listen(port);
app.use(sl);
app.post('/' + token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get("/", function(req, res) {

    User.find({}, function(err, users) {
        if (err) console.log(err);
        
        res.render('redem', {
            users: users
        })

    })

})


app.post("/send/coin",function(req,res) {
    if(req.body.user_id !== '' && req.body.amount !== ''){
      var tempUser = {
        status : true
    }  

        User.findByIdAndUpdate(req.body.user_id, tempUser, {
            new: true
        }, function(err, user) {
            if (err) {
                res.json({
                    done: false
                });
                console.log(err);
            } else {
                console.log(user);
                // res.json({done: true})

                setTimeout(function() {


    User.find({referalID: user.referrerID}, function(err, refferer) {
                       if (refferer.length !== 0) {
                       
                           bot.sendMessage(refferer[0].user_chat_id, "You have received a referal bonus")
                           var cr = Number(refferer[0].referals) + 1;
                           var cb = Number(refferer[0].balance) + 10;
                           var ur = {
                               referals: cr,
                               balance: cb
                           }
                           User.findByIdAndUpdate(refferer[0]._id, ur, {new: true}, function(err, done) {
                            bot.sendMessage(user.user_chat_id, "You account activated successfully")
                           })
                }else{

                    bot.sendMessage(user.user_chat_id, "You account activated successfully")
                }
    })


                    



                }, 5000)
            }
        })

    }else{
        res.json({done: false})
    }
    
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
                text: `Referals ${emoji.rocket} ${emoji.rocket}`
            }],
            [{
                text: 'Status'
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

    if (msg.from.last_name === undefined) {
        bot.sendMessage(chatId, "Last name not found")
            .then(function(sended) {
                bot.sendMessage(sended.chat.id, "Please add your last name than try again")
            })
    } else {

        console.log(referrerID);

        bot.sendMessage(chatId, `hi ${emoji.heart}`)

        var user = {
            name: msg.from.first_name + " " + msg.from.last_name,
            username: msg.from.username,
            user_chat_id: msg.chat.id
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

                bot.sendMessage(chatId, 'Welcome to our family. Follow the instractions to complete registraion')
                    .then(function(sended) {

                        console.log(sended);


                        bot.sendMessage(chatId, "Give us your number", option)
                            .then(function(sended) {

                                var chatId = sended.chat.id;
                                var messageId = sended.message_id;
                                previousMessage = sended.text;
                                bot.onReplyToMessage(chatId, messageId, function(message) {



                                    if (message.contact.phone_number) {


                                        var tempUser = {
                                            name: message.from.first_name + " " + message.from.last_name,
                                            username: message.from.username,
                                            phone_number: message.contact.phone_number,
                                            referrerID: referrerID,
                                            referalID: referalID,
                                            user_chat_id: message.chat.id
                                        }



                                User.create(tempUser, function(err, user) {
                                    if (err) console.log(err);
                                    if (referrerID && referrerID.length === 8) {
                                        User.find({
                                            referalID: referrerID
                                        }, function(err, refferer) {
                                            if (refferer.length === 0) {
                                                bot.sendMessage(chatId, "registraion complete")
                                                    .then(function() {
                                                        bot.sendMessage(chatId, "Use the commands to control your account", userControlKeyBoard)
                                                    })
                                            } else {
                                                bot.sendMessage(chatId, "registraion complete")
                                                    .then(function() {
                                                        bot.sendMessage(chatId, `You are refferd by ${refferer[0].name}`)
                                                        // bot.sendMessage(chatId, "You will get referal bonus after activataing your account")
                                                    }).then(function() {
                                                        bot.sendMessage(chatId, "Use the commands to control your account", userControlKeyBoard)
                                                    })
                                            }
                                        })
                                    } else {
                                        bot.sendMessage(chatId, "registraion complete")
                                            .then(function() {
                                                bot.sendMessage(chatId, "Use the commands to control your account", userControlKeyBoard)
                                            })
                                    }

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


    }
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
                name: msg.from.first_name + " " + msg.from.last_name,
                username: msg.from.username,
                user_chat_id: msg.chat.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {


                    bot.sendMessage(chatId, `You have ${ user[0].balance} taka`);

                } else {
                    bot.sendMessage(chatId, `${emoji.x}`);
                }
            })
        })()



    }
    if (msg.text === 'Status') {

        (async function() {
            var tempUser = {
                name: msg.from.first_name + " " + msg.from.last_name,
                username: msg.from.username,
                user_chat_id: msg.from.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {
                    var status = "Inactive"
                    if (user[0].status) {
                        status = 'Active'
                        bot.sendMessage(chatId, `Your Account  is ${status}`);
                    } else {
                        status = 'Not Active';
                        bot.sendMessage(chatId, `Your Account  is ${status}`);
                    }


                } else {
                    bot.sendMessage(chatId, `${emoji.x}`);
                }
            })
        })()


    }
    if (msg.text === 'Referals 🚀 🚀') {
        (async function() {
            var tempUser = {
                name: msg.from.first_name + " " + msg.from.last_name,
                username: msg.from.username,
                user_chat_id: msg.from.id
            }

            User.find(tempUser, function(err, user) {
                if (user.length !== 0) {

                    bot.sendMessage(chatId, `You have ${ user[0].referals} referals 
Invite your friends with your referral link: https://t.me/Sub_to_earn_bot?start=${user[0].referalID}`);

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


bot.onText(/\/sendMoneyDone/, (msg) => {
    console.log(msg);

})


bot.on("callback_query", (callbackQuery) => {


});



bot.on("polling_error", (err) => console.log(err));

// zvDKJ54987



cron.schedule('*/10 * * * *', function() {


    request('https://enigmatic-river-45127.herokuapp.com/', function(error, response, body) {

        // console.log('body:', body);
    });

});