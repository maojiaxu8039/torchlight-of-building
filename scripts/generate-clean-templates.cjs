const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      let data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() { resolve(data); });
      res.on("error", reject);
    }).on("error", reject);
  });
}

function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getAffixType(typeText) {
  if (!typeText) return null;
  const lower = typeText.toLowerCase();
  if (lower.includes("pre-fix")) return "Prefix";
  if (lower.includes("suffix")) return "Suffix";
  return null;
}

// 提取数值范围部分
function extractNumberRange(text) {
  const match = text.match(/^([^(]+)\(([^)]+)\)(.*)$/);
  if (match) {
    return {
      prefix: match[1].trim(),
      range: "(" + match[2] + ")",
      suffix: match[3].trim()
    };
  }
  return null;
}

async function main() {
  console.log("=== 生成干净的模板翻译 ===\n");
  
  // 抓取数据
  const html = await fetchUrl("https://tlidb.com/en/Belt");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/Belt");
  
  const enById = {};
  const cnById = {};
  
  // 提取 EN
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tdMatch;
    
    while ((tdMatch = tdRegex.exec(row)) !== null) {
      cells.push(cleanText(tdMatch[1]));
    }
    
    if (cells.length >= 3) {
      const idMatch = row.match(/data-modifier-id="(\d+)"/);
      const affixType = getAffixType(cells[2]);
      
      if (idMatch && affixType && cells[0]) {
        enById[idMatch[1]] = { text: cells[0], type: affixType };
      }
    }
  }
  
  // 提取 CN
  while ((rowMatch = rowRegex.exec(cnHtml)) !== null) {
    const row = rowMatch[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tdMatch;
    
    while ((tdMatch = tdRegex.exec(row)) !== null) {
      cells.push(cleanText(tdMatch[1]));
    }
    
    if (cells.length >= 1) {
      const idMatch = row.match(/data-modifier-id="(\d+)"/);
      if (idMatch && cells[0]) {
        cnById[idMatch[1]] = cells[0];
      }
    }
  }
  
  // 生成干净的模板翻译
  const templates = { Prefix: {}, Suffix: {} };
  
  Object.entries(enById).forEach(function(entry) {
    const id = entry[0];
    const data = entry[1];
    const enText = data.text;
    const cnText = cnById[id];
    
    if (cnText && enText !== cnText) {
      // 提取 EN 的词缀名称（移除数值范围）
      const enName = enText.replace(/\+\([\d-]+\)/g, "+(--)").replace(/\+[\d-]+%/g, "+--%");
      const enClean = enText.replace(/\+\([\d-]+\)/g, "").replace(/\+[\d-]+%/g, "").trim();
      
      // 提取 CN 的词缀名称（移除数值范围）
      const cnName = cnText.replace(/\+[\d-]+%/g, "+--%").replace(/\+\([\d-]+\)/g, "+(--)");
      const cnClean = cnText.replace(/\+[\d-]+%/g, "").replace(/\+\([\d-]+\)/g, "").trim();
      
      if (!templates[data.type][enClean]) {
        templates[data.type][enClean] = cnClean;
      }
    }
  });
  
  // 输出 Prefix 模板
  console.log("Prefix 模板 (" + Object.keys(templates.Prefix).length + "):\n");
  Object.entries(templates.Prefix).forEach(function(entry) {
    console.log("  '" + entry[0] + "': '" + entry[1] + "',");
  });
  
  console.log("\n\nSuffix 模板 (" + Object.keys(templates.Suffix).length + "):\n");
  Object.entries(templates.Suffix).forEach(function(entry) {
    console.log("  '" + entry[0] + "': '" + entry[1] + "',");
  });
  
  // 保存到文件
  fs.writeFileSync("scripts/affix-clean-templates.json", JSON.stringify(templates, null, 2));
  console.log("\n\n已保存到 scripts/affix-clean-templates.json");
}

main();
