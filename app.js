const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1909923497:AAG1GUNjun8KfQa2W92wf4MVOTWlXPAmZ5g';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
// bot.onText(/\/hi/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });


let users = []

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id
  users.push(chatId)

  bot.sendMessage(chatId, 'Welcome to our family. Hope you were well. Follow the instractions to complete registraion');
  bot.sendMessage(chatId, 'Are you refered by any user',{
               reply_markup: {
   keyboard: [
           [
               {
                   text: 'YES',
                   callback_data: "yes"
               }
           ],[{
                   text: 'NO',
                   callback_data: "no"
               }]
       ]
           }
  })

})


// bot.onText(/\/mycommand1/, (msg, match) => {
// const chatId = msg.chat.id;
// console.log(chatId)
// bot.sendMessage(chatId,"Good choice");

// })

bot.on('message',function(msg) {





  var robot = "I'm robot";
  if (msg.text.indexOf(robot) === 0) {
    bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
}

var location = "location";
    if (msg.text.indexOf(location) === 0) {
        bot.sendLocation(msg.chat.id,44.97108, -104.27719);
        bot.sendMessage(msg.chat.id, "Here is the point");

    }   


    if (msg.text.indexOf("YES") === 0) {
       
        bot.sendMessage(msg.chat.id, "Good to here");

    } if (msg.text.indexOf("NO") === 0) {
       
        bot.sendMessage(msg.chat.id, "Good to here");

    }

    if (msg.text.indexOf("antor") === 0) {
       
        bot.sendMessage(msg.chat.id,"Are antor kemon asis..?");

    }


})