//上班status = 0 ,下班status = 1
//迟到active = 0 ,未迟到active = 1
//早退active = 0 ,正常active = 1
const { now } = require("moment/moment");
const { error } = require("../module/logger");
const { DatabaseTransaction } = require("../module/mysql");
const moment = require("moment/moment");
const { replySend } = require("../module/send");

async function recordIn(bot,msg) {
    const chatId = msg.chat.id
    const userid = msg.from.id
    const name = msg.from.first_name + (msg.from?.last_name || '')
    const messageId = msg.message_id
    try{
        const db = new DatabaseTransaction()
        const now = moment()
        const check = await db.executeQuery('SELECT * FROM attendance WHERE status = 0 AND Date(join_in) = CURDATE() AND userid = ?',[userid])
        if(check.length !== 0) {
            replySend(bot,'不可以重复打卡上班',chatId,messageId)
            return
        }
        const time = await db.executeQuery('SELECT starttime FROM grouplist WHERE id = ?',[chatId],false)
        const lawtime = time[0].starttime
        const nowTime = now.format('HH:mm:ss')
        const isLate = moment(nowTime, 'HH:mm').isAfter(moment(lawtime, 'HH:mm'));
        let status = 0
        let active = 0
        let text = ''
        if (isLate) {
            active = 0
            text = `
【用户】${name}
【上班时间】${lawtime}
【打卡时间】${nowTime}
【<b>迟到了！</b>】`
            console.log('迟到了');
        } else {
            active = 1
            text = `
【用户】${name}
【上班时间】${lawtime}
【打卡时间】${nowTime}
【<b>未迟到！</b>】`
            console.log('还没迟到');
        }
        await db.executeQuery('INSERT INTO attendance (userid,groupid,status,active,close) VALUE (?,?,?,?,?)',[userid,chatId,status,active,lawtime],false)
        replySend(bot,text,chatId,messageId)
    }catch(err){
        console.log(err);
        return
    }
}


async function recordOut(bot,msg) {
    const chatId = msg.chat.id
    const userid = msg.from.id
    const name = msg.from.first_name + (msg.from?.last_name || '')
    const messageId = msg.message_id
    try{
        const db = new DatabaseTransaction()
        const now = moment()
        const check = await db.executeQuery('SELECT * FROM attendance WHERE status = 1 AND Date(join_in) = CURDATE() AND userid = ?',[userid])
        if(check.length !== 0) {
            replySend(bot,'不可以重复打卡下班',chatId,messageId)
            return
        }
        const time = await db.executeQuery('SELECT endtime FROM grouplist WHERE id = ?',[chatId],false)
        const lawtime = time[0].endtime
        const nowTime = now.format('HH:mm:ss')
        const isLate = moment(nowTime, 'HH:mm').isAfter(moment(lawtime, 'HH:mm'));
        let status = 1
        let active = 0
        let text = ''
        if (isLate) {
            active = 1
            text = `
【用户】${name}
【下班时间】${lawtime}
【打卡时间】${nowTime}
【<b>下班</b>】`
            console.log('迟到了');
        } else {
            active = 0
            text = `
【用户】${name}
【下班时间】${lawtime}
【打卡时间】${nowTime}
【<b>早退</b>】`
            console.log('还没迟到');
        }
        await db.executeQuery('INSERT INTO attendance (userid,groupid,status,active,close) VALUE (?,?,?,?,?)',[userid,chatId,status,active,lawtime],false)
        replySend(bot,text,chatId,messageId)
    }catch(err){
        console.log(err);
        return
    }
}

module.exports = {recordIn,recordOut}