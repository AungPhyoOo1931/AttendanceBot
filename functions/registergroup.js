const { DatabaseTransaction } = require("../module/mysql")
const { replySend } = require("../module/send")

async function registerggroup(bot,msg) {
    console.log(msg);
    
     const chatId = msg.chat.id
     const messageId = msg.message_id
     const name = msg.chat.title
     const db = new DatabaseTransaction()
     try{
        const select = await db.executeQuery('SELECT * FROM grouplist WHERE id = ?',[chatId])
        if(select.length !== 0){
            replySend(bot,'已经注册过',chatId,messageId)
            return
        }
        await db.executeQuery('INSERT INTO grouplist (id,username) VALUE (?,?)',[chatId,name],false)
        replySend(bot,'注册成功请继续设置上班时间与下班时间',chatId,messageId)
        
     }catch(err){
        console.log(err);
        return
     }
}

module.exports = registerggroup