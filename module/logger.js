// logger/logger.js
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },

    infoFile: {
      type: 'dateFile',
      filename: './logs/info.log',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      keepFileExt: true,
      encoding: 'utf-8'
    },

    errorFile: {
      type: 'dateFile',
      filename: './logs/error.log',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      keepFileExt: true,
      encoding: 'utf-8'
    },

    info: { type: 'logLevelFilter', appender: 'infoFile', level: 'info', maxLevel: 'warn' },
    error: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
  },
  categories: {
    default: { appenders: ['console', 'info', 'error'], level: 'debug' }
  }
});


const logger = log4js.getLogger('botx');

module.exports = logger;
