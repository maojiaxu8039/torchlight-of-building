const fs = require("fs");

console.log("=== 修复 Tower Sequence 翻译 ===\n");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

const towerTranslations = {};

// 提取 Tower Sequence 翻译并生成模板
Object.entries(translations).forEach(function(entry) {
  const en = entry[0];
  const cn = entry[1];
  
  // 检查是否是 Tower Sequence 翻译（包含 Intermediate/Advanced/Ultimate Sequence）
  if (en.includes("Sequence") || cn.includes("序列")) {
    // 生成模板：移除 Sequence 部分
    const enTemplate = en
      .replace(/Intermediate Sequence \d+[\d|]*/g, "")
      .replace(/Advanced Sequence \d+[\d|]*/g, "")
      .replace(/Ultimate Sequence \d+[\d|]*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    
    const cnTemplate = cn
      .replace(/中阶序列 \d+[\d|]*/g, "")
      .replace(/高阶序列 \d+[\d|]*/g, "")
      .replace(/终阶序列 \d+[\d|]*/g, "")
      .replace(/\s+/g, " ")
      .trim();
    
    if (enTemplate && cnTemplate && enTemplate.length > 5 && cnTemplate.length > 2) {
      towerTranslations[enTemplate] = cnTemplate;
    }
  }
});

console.log("生成了 " + Object.keys(towerTranslations).length + " 个 Tower Sequence 模板翻译");

// 读取游戏数据中的 Tower Sequence
const towerFiles = fs.readdirSync("src/data/gear-affix").filter(f => f.includes("tower-sequence"));
let matched = 0;

towerFiles.forEach(file => {
  const content = fs.readFileSync("src/data/gear-affix/" + file, "utf8");
  const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);
  
  if (affixMatches) {
    affixMatches.forEach(m => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];
      
      // 检查是否已有翻译
      if (!translations[affix]) {
        // 尝试模板匹配
        const enTemplate = affix.replace(/\s+/g, " ").trim();
        
        // 精确匹配
        if (towerTranslations[enTemplate]) {
          translations[affix] = towerTranslations[enTemplate];
          matched++;
        }
      }
    });
  }
});

console.log("通过模板匹配新增 " + matched + " 个 Tower Sequence 翻译");

// 保存翻译
const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const result = {};
sorted.forEach(e => { result[e[0]] = e[1]; });
fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));

console.log("翻译已保存，总计 " + Object.keys(result).length);
