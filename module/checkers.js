const logger = require("./logger");

function isPrivate(handler) {
    return (bot, msg, ...args) => {
      if (msg.chat.type !== 'private') {
        return bot.sendMessage(msg.chat.id, '当前指令只能在私人聊天中使用！');
      }
      return handler(bot, msg, ...args);
    };
  }
  
  function isGroup(handler) {
    return (bot, msg, ...args) => {
      if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
        return bot.sendMessage(msg.chat.id, '该指令只能在群组中使用！');
      }
      return handler(bot, msg, ...args);
    };
  } 
  
  function isAdmin(handler) {
    return async (bot, msg, ...args) => {
      const chat = msg.chat;
  
      if (chat.type !== 'group' && chat.type !== 'supergroup') {
        return bot.sendMessage(chat.id, '该指令只能在群组中使用！');
      }
  
      try {
        const member = await bot.getChatMember(chat.id, msg.from.id);
        if (member.status === 'administrator' || member.status === 'creator') {
          return handler(bot, msg, ...args);
        } else {
          return bot.sendMessage(chat.id, '您不是管理员，无法使用此指令！');
        }
      } catch (err) {
        logger.error(err)
        console.error('获取管理员信息失败：', err);
        return bot.sendMessage(chat.id, '无法验证管理员身份，请稍后重试。');
      }
    };
  }
  
  module.exports = {
    isPrivate,
    isGroup,
    isAdmin,
  };
  