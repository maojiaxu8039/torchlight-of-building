const fs = require("fs");

const html = fs.readFileSync(".garbage/tlidb/gear/belt.html", "utf-8");

console.log("🔍 Testing regex matching\n");

// 测试正则表达式
const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<i\s|data-modifier-id="|$)/gi;
let idMatch;
let count = 0;

while ((idMatch = idRegex.exec(html)) !== null) {
  const modifierId = idMatch[1];
  let text = idMatch[2];
  
  console.log(`ID: ${modifierId}`);
  console.log(`Raw text: ${text}`);
  
  // 清理文本
  text = text
    .replace(/data-bs-title="[^"]*"/g, '')
    .replace(/data-bs-html="[^"]*"/g, '')
    .replace(/data-bs-toggle="[^"]*"/g, '')
    .replace(/<div[^>]*>/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<i[^>]*>.*?<\/i>/gi, '')
    .replace(/<e[^>]*>([^<]*)<\/e>/gi, '$1')
    .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log(`Cleaned: ${text}`);
  console.log("---");
  
  count++;
  if (count >= 5) break;
}
