const { DatabaseTransaction } = require("../module/mysql")
const { replySend } = require("../module/send")

async function register(bot,msg) {
    const chatId = msg.chat.id
    const userid = msg.from.id
    const username = msg.from?.username || ''
    const name = msg.from?.first_name + (msg.from?.last_name || '')
    const messageId = msg.message_id
    try{    
        const db = new DatabaseTransaction()
        const select = await db.executeQuery('SELECT * FROM users WHERE id = ?',[userid],false)
        console.log(select);
        
        if(select.length !== 0){
            replySend(bot,'已经注册过了',chatId,messageId)
            return
        }
        await db.executeQuery('INSERT INTO users (id,username,name) VALUE (?,?,?)',[userid,username,name],false)
        replySend(bot,'注册成功开始记录打卡情况',chatId,messageId)
    }catch(err){
        console.log(err);
        return
    }
}

module.exports = register