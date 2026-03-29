const https = require("https");
const http = require("http");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    });
    request.on("error", reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

function parseModifiers(html, lang) {
  const modifiers = {};
  
  // 匹配整个 <td>...</td> 块
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let tdMatch;
  let currentId = null;
  
  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const tdContent = tdMatch[1];
    
    // 检查是否包含 data-modifier-id
    const idMatch = tdContent.match(/data-modifier-id="(\d+)"/);
    if (idMatch) {
      currentId = idMatch[1];
      
      // 提取所有文本内容（包括嵌套的 span）
      let text = tdContent;
      text = text.replace(/<[^>]+>/g, " ");
      text = text.replace(/&nbsp;/g, " ");
      text = text.replace(/&ndash;/g, "-");
      text = text.replace(/&amp;/g, "&");
      text = text.replace(/\s+/g, " ").trim();
      
      if (text && currentId) {
        modifiers[currentId] = text;
      }
    }
  }
  
  return modifiers;
}

async function main() {
  console.log("🔍 测试修复后的解析...\n");

  const enHtml = await fetchUrl("https://tlidb.com/en/Wand");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/Wand");
  
  const enModifiers = parseModifiers(enHtml, "en");
  const cnModifiers = parseModifiers(cnHtml, "cn");
  
  console.log(`EN modifiers: ${Object.keys(enModifiers).length}`);
  console.log(`CN modifiers: ${Object.keys(cnModifiers).length}`);
  
  // 查找 "Adds" 相关的词缀
  console.log("\n检查 Adds 词缀:");
  Object.entries(enModifiers).forEach(([id, text]) => {
    if (text.includes("Adds") && text.includes("Spells")) {
      const cn = cnModifiers[id] || "N/A";
      console.log(`EN [${id}]: ${text}`);
      console.log(`CN [${id}]: ${cn}`);
      console.log();
    }
  });
  
  // 检查匹配
  let matched = 0;
  Object.keys(enModifiers).forEach(id => {
    if (cnModifiers[id]) matched++;
  });
  console.log(`匹配: ${matched} / ${Object.keys(enModifiers).length}`);
}

main().catch(console.error);
