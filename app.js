var dotenv         = require('dotenv').config();

var TelegramBot = require('node-telegram-bot-api');
var token = process.env.TELEGRAM_HTTP_TOKEN;
var bot = new TelegramBot(token, {polling: true});
var emoji = require('node-emoji').emoji;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());
 
app.listen(process.env.PORT);
 
app.post('/' + token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});






let users = [];
var ref = [21344,32432,32432,56445,43546,67545,35452]

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  users.push(chatId)
// bot.sendMessage(chatId,yin_yang)
// bot.sendMessage(chatId,`hi ${emoji.heart}`)
  bot.sendMessage(chatId, 'Welcome to our family. Hope you were well. Follow the instractions to complete registraion');
  bot.sendMessage(chatId, 'Do you have any invitation/referal code ?',{
               reply_markup: {
   inline_keyboard: [
           [
               {
                   text: 'YES',
                   callback_data: "haveReferalCode"
               },{
                   text: 'NO',
                   callback_data: "dontHaveReferalCode"
               }
           ]
       ]
           }
  })

})

 
/*bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId,"fdfdsfgewr  ert retre f d")
    bot.sendMessage(chatId,"fdfdsfgewr  ert retre f d")
    bot.sendMessage(chatId,"hi")
})*/



bot.on('message',function(msg) {





 


    if (msg.text.indexOf("YES") === 0) {
       
        bot.sendMessage(msg.chat.id, "Good to here");

    }else if (msg.text.indexOf("NO") === 0) {
       
        bot.sendMessage(msg.chat.id, "Sounds bad");

    }

    if (msg.text.indexOf("antor") === 0) {
       
        bot.sendMessage(msg.chat.id,"antor kemon asis..?");

    }


})


bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const msg2 = callbackQuery.data;

    // console.log(callbackQuery)
   if(msg2 === 'haveReferalCode'){
        bot.answerCallbackQuery(callbackQuery.id)
    .then(() => bot.sendMessage(msg.chat.id, "Enter the code like this, example: code: 23452 "))
    .then(() =>  {
      
     

        bot.on('message',function(msg) {
        var chatId = msg.chat.id;
var c = msg.text;
var s = c.split("code: ");
  if (c.includes("code: ")) {

     if(ref.indexOf(Number(s[1])) !== -1 && s[1].length == 5){
    
       bot.sendMessage(chatId, "Bonuse added succesfully");
       
 
      }
     else if ( s[1] !== 5 || ref.indexOf(Number(s[1])  == -1 )) {
        bot.sendMessage(chatId, "Wrong invitation /  referal code");
        
      }

  }
 
   
 
      })
 


    })

   }else if(msg2 === 'dontHaveReferalCode') {
      bot.answerCallbackQuery(callbackQuery.id)
    .then(() => bot.sendMessage(msg.chat.id, "Okey"))
    .then(() => {
      bot.sendMessage(msg.chat.id, "Enter your number")
    })
   }

}); 
