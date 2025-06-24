const logger = require("./logger");
const { DatabaseTransaction } = require("./mysql");

async function getLang(userid) {
    const db = new DatabaseTransaction()
    try{
        const langSql = await db.executeQuery('SELECT lang FROM users WHERE id = ?',[userid],false)
        const lang = langSql[0]?.lang
        return lang
    }catch(err){
        logger.error(err)
        return
    }
}
module.exports = getLang