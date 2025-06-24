const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { DatabaseTransaction } = require('./mysql');

async function htmlToImage(first, second, third) {
  const toBase64 = (filePath) => {
    const imgBuffer = fs.readFileSync(filePath);
    const mime = 'image/jpeg';
    return `data:${mime};base64,${imgBuffer.toString('base64')}`;
  };

  const baseDir = path.resolve(__dirname, '../image');
  const img1 = toBase64(path.join(baseDir, `${first}.jpg`));
  const img2 = toBase64(path.join(baseDir, `${second}.jpg`));
  const img3 = toBase64(path.join(baseDir, `${third}.jpg`));

  const html = `
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      background: non;  /* 或者 none */
    }
    img {
      width: 200px;
      margin: 0;
      display: block;
    }
  </style>
</head>
<body>
  <img src="${img1}">
  <img src="${img2}">
  <img src="${img3}">
</body>
</html>
`;


  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 200 });
  await page.setContent(html);

  const outputPath = path.resolve(__dirname, '../image/result.jpg');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 100,
    fullPage: false
  });

  await browser.close();
  console.log(`✅ 图片生成成功：${outputPath}`);
}

async function historyPhoto() {
  const toBase64 = (filePath) => {
    const imgBuffer = fs.readFileSync(filePath);
    const mime = 'image/jpeg';
    return `data:${mime};base64,${imgBuffer.toString('base64')}`;
  };

  const db = new DatabaseTransaction()
  const result = await db.executeQuery('SELECT result,id FROM gamelist WHERE isopen = 1 AND isclose = 1 order by id desc limit 10',false)
  const text = result.map(item => {
    const betresult = JSON.parse(item.result)
    let first = betresult[0]
    let second = betresult[1]
    let third = betresult[2]
    const baseDir = path.resolve(__dirname, '../image');
    const img1 = toBase64(path.join(baseDir, `${first}.jpg`));
    const img2 = toBase64(path.join(baseDir, `${second}.jpg`));
    const img3 = toBase64(path.join(baseDir, `${third}.jpg`));
    return`
    <tr>
                <td>${String(item.id).padStart(6,'0')}</td>
                <td>
                    <img src="${img1}">
                    <img src="${img2}">
                    <img src="${img3}">
                </td>
            </tr>`
  }).join('')

  const html = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        table{
            border-collapse: collapse;
            text-align: center;
        }
        table thead tr {
            background-color: black;
            color: #fff;
        }
        table img{
          width: 40px;
          height: 40px;
          display: inline-block;
          
          }
          table td{
            width: 150px;
            border: 4px solid black;
            font-size: 20px;
            line-height: 20px;
            }
            table thead tr td{
              padding: 10px 0;
              font-size: 20px;
            }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>
                <td>期数</td>
                <td>开奖结果</td>
            </tr>
        </thead>
        <tbody>
            ${text}
        </tbody>
    </table>
</body>
</html>
`;


  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 300, height: 500 });
  await page.setContent(html);

  const outputPath = path.resolve(__dirname, '../image/history.jpg');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 100,
    fullPage: false
  });

  await browser.close();
  console.log(`✅ 图片生成成功：${outputPath}`);
}

module.exports = {htmlToImage,historyPhoto};
