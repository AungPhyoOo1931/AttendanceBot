const ExcelJS = require('exceljs');
const fs = require('fs');
const { now } = require('moment');
const path = require('path');
const { DatabaseTransaction } = require('../module/mysql');
const { ysmc } = require('../module/time');
const { flushCompileCache } = require('module');

async function check(msg) {
    const chatId = msg.chat.id
    const userid = msg.from.id
    const messageId = msg.message_id
    try{
        const db = new DatabaseTransaction()
        const sql = `select count(*) as day,a.userid,name,groupid,g.username,a.status, a.active FROM attendance as a, users as u, grouplist as g WHERE a.userid = u.id AND a.groupid = g.id AND status = 0 AND active = 1 AND a.groupid = ? AND DATE_FORMAT(a.join_in, \'%Y-%m\') = DATE_FORMAT(CURDATE(), \'%Y-%m\') group by userid
union
select count(*) as day,a.userid,name,groupid,g.username,a.status, a.active  FROM attendance as a, users as u, grouplist as g WHERE a.userid = u.id AND a.groupid = g.id AND status = 0  AND active = 0 AND a.groupid = ?  AND DATE_FORMAT(a.join_in, \'%Y-%m\') = DATE_FORMAT(CURDATE(), \'%Y-%m\') group by userid
union
select count(*) as day,a.userid,name,groupid,g.username,a.status, a.active  FROM attendance as a, users as u, grouplist as g WHERE a.userid = u.id AND a.groupid = g.id AND status = 1 AND active = 0 AND a.groupid = ?  AND DATE_FORMAT(a.join_in, \'%Y-%m\') = DATE_FORMAT(CURDATE(), \'%Y-%m\') group by userid
union
select count(*) as day,a.userid,name,groupid,g.username,a.status, a.active  FROM attendance as a, users as u, grouplist as g WHERE a.userid = u.id AND a.groupid = g.id AND status = 1 AND active = 1 AND a.groupid = ?  AND DATE_FORMAT(a.join_in, \'%Y-%m\') = DATE_FORMAT(CURDATE(), \'%Y-%m\') group by userid
`
        const sele = await db.executeQuery(sql,[chatId,chatId,chatId,chatId],false)
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
    { header: '名称', key: 'name', width: 20 },
    { header: '群组', key: 'group', width: 15 },
    { header: '正常上班', key: 'normalup', width: 15 },
    { header: '正常下班', key: 'normalout', width: 15 },
    { header: '迟到', key: 'spup', width: 15 },
    { header: '早退', key: 'spout', width: 15 },
    { header: '共计打卡', key: 'total', width: 15 },
    
  ];

  const shangban = await check(msg)
  const tempData = shangban.map(item => {
    const name = item.name
    const groupName = item.username
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
    const day = item.day
    const res = {
        name:name,
        groupName:groupName,
        status:statusText,
        active:activeText,
        day:day
    }
    return res
  })

 const resultMap = {};

tempData.forEach(item => {
    const key = `${item.name}_${item.groupName}`;
    if (!resultMap[key]) {
        resultMap[key] = {
            name: item.name,
            groupName: item.groupName,
            normalup: 0,
            normalout: 0,
            spup: 0,
            spout: 0
        };
    }

    if (item.status === '上班') {
        if (item.active === '正常') {
            resultMap[key].normalup = item.day;
        } else if (item.active === '迟到') {
            resultMap[key].spup = item.day;
        }
    } else if (item.status === '下班') {
        if (item.active === '正常') {
            resultMap[key].normalout = item.day;
        } else if (item.active === '早退') {
            resultMap[key].spout = item.day;
        }
    }
});

const result = Object.values(resultMap);
console.log(result);
  result.forEach((item,index) => {
    worksheet.addRow({
        id:index + 1,
        name:item.name,
        group:item.groupName,
        normalup:item.normalup,
        normalout:item.normalout,
        spup:item.spup,
        spout:item.spout,
        total:(item.normalup + item.normalout + item.spup + item.spout)
    })
  });
  await workbook.xlsx.writeFile(path.resolve(__dirname, outputPath));
  console.log(`Excel 文件已生成：${outputPath}`);
}



async function getDataAll(bot,msg) {
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

module.exports = getDataAll