const fs = require("fs");
const path = require("path");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 扫描 gear-affix-new 目录
const newDir = "src/data/gear-affix-new";
const files = fs.readdirSync(newDir).filter((f) => f.endsWith(".ts"));

let added = 0;

files.forEach((file) => {
  const content = fs.readFileSync(path.join(newDir, file), "utf8");
  const matches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (matches) {
    matches.forEach((m) => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];
      if (!translations[affix]) {
        // 生成翻译（使用模板替换）
        let cn = affix
          .replace(/%/g, "%")
          .replace(/\+\s*/g, "+")
          .replace(/\s+/g, " ");

        // 基本翻译规则
        cn = cn
          .replace(/Max Life/g, "最大生命")
          .replace(/Max Mana/g, "最大魔力")
          .replace(/Max Energy Shield/g, "最大护盾")
          .replace(/Life Regeneration Speed/g, "生命回复速度")
          .replace(/Critical Strike Rating/g, "暴击值")
          .replace(/Critical Strike Damage/g, "暴击伤害")
          .replace(/Attack Speed/g, "攻击速度")
          .replace(/Cast Speed/g, "施法速度")
          .replace(/Movement Speed/g, "移动速度")
          .replace(/Fire Resistance/g, "火焰抗性")
          .replace(/Cold Resistance/g, "冰冷抗性")
          .replace(/Lightning Resistance/g, "闪电抗性")
          .replace(/Erosion Resistance/g, "腐蚀抗性")
          .replace(/Elemental Resistance/g, "元素抗性")
          .replace(/Minion/g, "召唤物")
          .replace(/Damage/g, "伤害")
          .replace(/Command per second/g, "每秒指令")
          .replace(/Spirit Magi/g, "魔灵")
          .replace(/Frostbite Rating/g, "冻伤值")
          .replace(/Hasten/g, "迅捷")
          .replace(/Double Damage/g, "双倍伤害")
          .replace(/initial Growth/g, "初始成长")
          .replace(/While Reconjuring/g, "重组时")
          .replace(/regenerate/g, "回复")
          .replace(/per second/g, "每秒")
          .replace(/chance for Minions to deal/g, "召唤物触发")
          .replace(/\+\s*/g, "+")
          .replace(/Minion/g, "召唤物");

        translations[affix] = cn;
        added++;
      }
    });
  }
});

console.log("扫描文件:", files.length);
console.log("新增翻译:", added);
console.log("总计:", Object.keys(translations).length);
