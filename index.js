require('dotenv').config
const TelegramBot = require('node-telegram-bot-api')
const { isPrivate, isGroup, isAdmin } = require('./module/checkers')
const registerggroup = require('./functions/registergroup')
const { checkTime, ms } = require('./module/time')
const updatetime = require('./functions/updatetime')
const register = require('./functions/register')
const {recordIn,recordOut} = require('./functions/record')
const check = require('./functions/check')
const getData = require('./functions/check')
const getDataAll = require('./functions/getData')
const TOKEN = process.env.BOT_TOKEN
const bot = new TelegramBot(TOKEN,{polling:true})

bot.onText(/^注册$/,(msg) => {
    isGroup(register)(bot,msg)
})

bot.onText(/^开始$/,(msg) => {
    isAdmin(registerggroup)(bot,msg)
})

bot.onText(/^上班时间\s*(\d{1,2}:\d{1,2})$/, async (msg, match) => {
  isAdmin(updatetime)(bot,msg,match,0)
});

bot.onText(/^下班时间\s*(\d{1,2}:\d{1,2})$/, async (msg, match) => {
  isAdmin(updatetime)(bot,msg,match,1)
});

bot.onText(/^上班$/,(msg) => {
    isGroup(recordIn)(bot,msg)
})

bot.onText(/^下班$/,(msg) => {
    isGroup(recordOut)(bot,msg)
})

bot.onText(/^查看$/,(msg) => {
    getData(bot,msg)
})

bot.onText(/^统计本月$/,(msg) => {
    isAdmin(getDataAll)(bot,msg)
})