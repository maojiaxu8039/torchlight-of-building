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

async function scrapePage(slug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/" + slug),
      fetchUrl("https://tlidb.com/cn/" + slug),
    ]);
    
    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return { templates: {}, translations: {} };
    }
    
    const enById = {};
    const cnById = {};
    
    // 提取表格行
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(enHtml)) !== null) {
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
        
        if (idMatch && affixType) {
          enById[idMatch[1]] = { text: cells[0], type: affixType };
        }
      }
    }
    
    while ((rowMatch = rowRegex.exec(cnHtml)) !== null) {
      const row = rowMatch[1];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;
      const cells = [];
      
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
    
    // 生成翻译
    const templates = {};
    const translations = {};
    
    Object.entries(enById).forEach(function(entry) {
      const id = entry[0];
      const data = entry[1];
      const enText = data.text;
      const cnText = cnById[id];
      
      if (cnText && enText !== cnText) {
        translations[enText] = cnText;
        
        // 生成模板：移除数值范围，保留词缀名称
        const template = enText.replace(/\+\(\d+-\d+\)/g, "+(--)").replace(/\+\d+-\d+/g, "+--");
        if (!templates[data.type]) templates[data.type] = {};
        
        // 提取词缀名称部分
        const namePart = template.replace(/\+\(--\)/g, "").replace(/\+--/g, "").trim();
        templates[data.type][namePart] = cnText.replace(/\+\(--\)/g, "").replace(/\+--/g, "").trim();
      }
    });
    
    return { templates, translations };
  } catch (e) {
    return { templates: {}, translations: {} };
  }
}

async function main() {
  console.log("=== 抓取 Prefix/Suffix 模板翻译 ===\n");
  
  // 只抓取几个代表性装备
  const testEquipments = [
    { slug: "Belt", name: "Belt" },
    { slug: "Necklace", name: "Necklace" },
    { slug: "Helmet-Str", name: "Helmet-Str" },
  ];
  
  const allTemplates = { Prefix: {}, Suffix: {} };
  let totalTranslations = 0;
  
  for (let i = 0; i < testEquipments.length; i++) {
    const eq = testEquipments[i];
    process.stdout.write(eq.name + "... ");
    
    const result = await scrapePage(eq.slug);
    
    Object.entries(result.templates).forEach(function(entry) {
      const type = entry[0];
      const templates = entry[1];
      
      Object.entries(templates).forEach(function(t) {
        if (!allTemplates[type][t[0]]) {
          allTemplates[type][t[0]] = t[1];
        }
      });
    });
    
    totalTranslations += Object.keys(result.translations).length;
    console.log(Object.keys(result.translations).length + " 翻译");
    
    await new Promise(function(r) { setTimeout(r, 100); });
  }
  
  console.log("\n=== 生成的模板翻译 ===");
  
  // 输出 Prefix 模板
  console.log("\nPrefix 模板 (" + Object.keys(allTemplates.Prefix).length + "):");
  Object.entries(allTemplates.Prefix).forEach(function(entry) {
    console.log("  " + entry[0] + " -> " + entry[1]);
  });
  
  // 输出 Suffix 模板
  console.log("\nSuffix 模板 (" + Object.keys(allTemplates.Suffix).length + "):");
  Object.entries(allTemplates.Suffix).forEach(function(entry) {
    console.log("  " + entry[0] + " -> " + entry[1]);
  });
  
  // 保存模板翻译到文件
  fs.writeFileSync("scripts/affix-templates.json", JSON.stringify(allTemplates, null, 2));
  console.log("\n模板翻译已保存到 scripts/affix-templates.json");
}

main();
