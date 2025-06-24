/*
 * Project: 记账机器人
 * Author: AungPhyoOo1931
 * License: MIT
 * Year: 2025
 */

const moment = require("moment/moment");

function ysmc (time){
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

function ms(time){
    return moment(time).format('HH:mm:ss')
}

function checkTime(timeStr) {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(timeStr);
  if (!match) return null;

  const hour = match[1].padStart(2, '0');
  const minute = match[2].padStart(2, '0');

  // 限制在 00:00 ~ 23:59
  if (+hour > 23 || +minute > 59) return null;

  return `${hour}:${minute}`;
}

module.exports = {
    checkTime,
    ysmc,
    ms
}