function parseAmount(input) {
    if (!input) return null;
  
    // 处理 k 或 K
    const kMatch = input.match(/^(\d+(?:\.\d+)?)k$/i);
    if (kMatch) {
      return Math.round(parseFloat(kMatch[1]) * 1000);
    }
  
    // 纯数字
    if (/^\d+$/.test(input)) {
      return parseInt(input, 10);
    }
  
    const chineseMap = {
      '零': 0, '〇': 0,
      '一': 1, '二': 2, '两': 2, '三': 3, '四': 4,
      '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
    };
  
    const unitMap = {
      '十': 10, '百': 100, '千': 1000, '万': 10000
    };
  
    let result = 0;
    let section = 0; // 每段的值，如 万 前的一段
    let number = 0;
  
    const chars = [...input];
  
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
  
      if (chineseMap[char] !== undefined) {
        number = chineseMap[char];
      } else if (unitMap[char]) {
        const unit = unitMap[char];
        if (number === 0 && (char === '十' || char === '百' || char === '千')) {
          number = 1; // "十" => 10，相当于 "一十"
        }
        section += number * unit;
        number = 0;
      } else {
        return null; // 无法识别的字符
      }
    }
  
    result += section + number;
    return result || null;
  }
  

  module.exports = parseAmount