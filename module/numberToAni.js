function numberToAni(number, lang) {
  const animalLang = {
    zh: { 1: '鸡', 2: '鱼', 3: '龟', 4: '虎', 5: '象', 6: '虾' },
    my: { 1: 'ကြက်', 2: 'ငါး', 3: 'လိပ်', 4: 'ကျား', 5: 'ဆင်', 6: 'ပုဇွန်' }
  };
  number = Number(number)

  if (!number) {
    return '';
  } else {
    return animalLang[lang][number] || '';
  }
}

module.exports = numberToAni;
