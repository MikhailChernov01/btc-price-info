var TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
require('dotenv').config();

//polling options
var opt = { polling: true };

//create bot
var bot = new TelegramBot(process.env.BOT_TOKEN, opt);

//declARE 
let currentPrice = null;
let previousPrice = null;


bot.onText(/\/start/, function (msg) {


  //get sender id
  var clientTd = msg.chat.id;
  console.log(`client id: ${clientTd}`);

  var name = msg.from.first_name
  bot.sendMessage(clientTd, `Привет, ${name}!\nНе следишь за ценой битка?\nТогда каждый час тебе сюда будет прилетать курс BTC к USD `);

  if (previousPrice === null) { 
      async function firstCall(){
        const response = await fetch('https://blockchain.info/ticker');
        const json = await response.json();
        currentPrice = json.USD.last;
        //console.log(currentPrice);

        bot.sendMessage(clientTd, `BTC сейчас: \n${currentPrice.toString()} $`);
        previousPrice = currentPrice;
      };
      firstCall(); 
  } 

  setInterval(() => (getShowPrice()), 3600000);

  const getShowPrice = async () => {
        const response = await fetch('https://blockchain.info/ticker');
        const json = await response.json();
        currentPrice = json.USD.last;
        console.log(currentPrice);

        let changePercent = (((currentPrice - previousPrice) * 100) / previousPrice).toFixed(2);

        function displayArrow(change){
          if (change > 0){
            return '↑';
          } else if (change < 0){
            return '↓';
          } else {
            return '';
          }
        }

        function displayDifference(change){
          if (change > 0){
            return `+${change.toFixed(2)} $\n`;
          } else if (change < 0){
            return  `${change.toFixed(2)} $\n`;
          } else {
            return '';
          }
        }

        //send msg with current price
        bot.sendMessage(clientTd, `BTC: \n${currentPrice.toString()} $\nИзменение за час:\n${displayDifference(currentPrice - previousPrice)}${displayArrow(currentPrice - previousPrice)} ${changePercent.toString()} %`);
        previousPrice = currentPrice;
      };



});

