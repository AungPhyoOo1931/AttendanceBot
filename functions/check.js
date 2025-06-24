const ExcelJS = require('exceljs');
const fs = require('fs');
const { now } = require('moment');
const path = require('path');
const { DatabaseTransaction } = require('../module/mysql');
const { ysmc } = require('../module/time');

async function check(msg) {
    const chatId = msg.chat.id
    const userid = msg.from.id
    const messageId = msg.message_id
    try{
        const db = new DatabaseTransaction()
        const sele = await db.executeQuery(`SELECT status,active,close,join_in FROM attendance WHERE userid = ? AND groupid = ? 
            AND DATE_FORMAT(join_in, \'%Y-%m\') = DATE_FORMAT(CURDATE(), \'%Y-%m\')`,[userid,chatId])
        console.log(sele);
        return sele
    }catch(err){
        console.log(err);
        return
    }
}


async function generateExcel(outputPath,msg) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('考勤');
  // 表头
  worksheet.columns = [
    { header: '序', key: 'id', width: 10 },
    { header: '打卡时间', key: 'name', width: 20 },
    { header: '规定时间', key: 'topUp', width: 15 },
    { header: '类型', key: 'topOut', width: 20 },
    { header: '状态', key: 'totalBet', width: 30 },
  ];

  const shangban = await check(msg)

  shangban.forEach((item, index) => {
    let statusText = ''
    let activeText = ''
    if(item.status === 0){
        statusText = '上班'
        if(item.active === 0){
            activeText = '迟到'
        }else{
            activeText = '正常'
        }
    }else{
        statusText = '下班'
        if(item.active === 0){
            activeText = '早退'
        }else{
            activeText = '正常'
        }
    }
    worksheet.addRow({
        id: index + 1,
        name: ysmc(item.join_in),
        topUp: item.close,
        topOut: statusText,
        totalBet: activeText
    });  
  });

  await workbook.xlsx.writeFile(path.resolve(__dirname, outputPath));
  console.log(`Excel 文件已生成：${outputPath}`);
}



async function getData(bot,msg) {
    // 生成
    const now = Date.now()
    const filePath = path.resolve(__dirname, `./files/考勤.xlsx`);
    const chatId = msg.from.id
    await generateExcel(filePath,msg);
    if (!fs.existsSync(filePath)) {
        return bot.sendMessage(chatId, 'Excel 文件不存在。请先生成文件。');
    }

    bot.sendDocument(chatId, fs.createReadStream(filePath), {
    caption: '这是您的报表',
    }).catch(err => {
    console.error('发送文件出错：', err);
    bot.sendMessage(chatId, '发送文件失败，请稍后重试。');
    });

}

module.exports = getData