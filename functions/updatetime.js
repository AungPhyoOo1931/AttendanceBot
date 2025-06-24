const { DatabaseTransaction } = require("../module/mysql");
const { checkTime } = require("../module/time");

async function updatetime(bot,msg,match,type){
    const chatId = msg.chat.id;

  try {
    const rawTime = match?.[1];
    const workStartTime = checkTime(rawTime);

    if (!workStartTime) {
      return bot.sendMessage(chatId, `❌ 时间格式错误，请使用 HH:MM（例如 07:30）`);
    }

    const db = new DatabaseTransaction();
    if(type === 0){
        await db.executeQuery(
          'UPDATE grouplist SET starttime = ? WHERE id = ?',
          [workStartTime, chatId],
          false
        );
        bot.sendMessage(chatId, `✅ 已设置上班时间为：${workStartTime}`);
    }else{
        await db.executeQuery(
          'UPDATE grouplist SET endtime = ? WHERE id = ?',
          [workStartTime, chatId],
          false
        );
             bot.sendMessage(chatId, `✅ 已设置下班时间为：${workStartTime}`);
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `出现未知错误`);
  }
}

module.exports = updatetime