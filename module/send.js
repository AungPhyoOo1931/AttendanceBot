
const fs = require('fs')
const path = require('path')
const getLang = require('./checklang')
async function sendMessage(bot,text,chatId){
    const lang = await getLang(chatId)
    if(lang === 'zh'){
        const options = {
            parse_mode:'HTML',
            reply_markup:{
                keyboard:[
                    ['🏠佣金提现','🏧代理中心'],
                    ['游戏规则','开始游戏','我要充值'],
                    ['最近投注','账单记录','个人中心']
                ],
                resize_keyboard:true,
                one_time_keyboard:false
            }
        }
        bot.sendMessage(chatId,text,options)
    }else{
        const options = {
            parse_mode:'HTML',
            reply_markup:{
                keyboard:[
                    ['🏧အေးဂျင့်စင်တာ','🏠ကော်မရှင်ထုတ်ယူခြင်း'],
                    ['ဂိမ်းကစားနည်း','ဂိမ်းစတင်ပါ','ငွေသွင်း/ငွေထုတ်'],
                    ['အလောင်းအစား','ဘေလ်မှတ်တမ်း','ငါ့အချက်အလက်']
                ],
                resize_keyboard:true,
                one_time_keyboard:false
            }
        }
        bot.sendMessage(chatId,text,options)
    }
}

function normalSend(bot,text,chatId){
    const options = {
        parse_mode:'HTML'
    }
    bot.sendMessage(chatId,text,options)
}


function replySend(bot,text,chatId,message_id){
    const options = {
        parse_mode:'HTML',
        reply_to_message_id:message_id
    }
    bot.sendMessage(chatId,text,options)
}

async function sendPhoto(bot,text,chatId,url,reply_markup){
     const imagePath = path.resolve(__dirname, url);
        bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
            caption: text,
            parse_mode: 'HTML',
            reply_markup: reply_markup
        })
    }
module.exports = {
    sendMessage,
    replySend,
    normalSend,
    sendPhoto
}