const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 常见伤害/属性类型
const statTypes = [
  "Movement Speed",
  "Attack Speed",
  "Cast Speed",
  "Critical Strike Rating",
  "Critical Strike Damage",
  "Life Regeneration Speed",
  "Mana Regeneration Speed",
  "Max Life",
  "Max Mana",
  "Max Energy Shield",
  "Fire Resistance",
  "Cold Resistance",
  "Lightning Resistance",
  "Erosion Resistance",
  "Elemental Resistance",
  "Armor",
  "Evasion",
  "Block Chance",
  "Spell Block Chance",
  "Attack Block Chance",
  "Physical Damage",
  "Fire Damage",
  "Cold Damage",
  "Lightning Damage",
  "Erosion Damage",
  "Elemental Damage",
  "Spell Damage",
  "Attack Damage",
  "Melee Damage",
  "Minion Damage",
  "Cooldown Recovery Speed",
  "Skill Effect Duration",
  "Skill Area",
  "Ailment Duration",
  "Deterioration Damage",
  "Trauma Damage",
  "Wilt Damage",
  "Ignite Damage",
];

// 常见数值范围
const percentages = [
  "+1%",
  "+2%",
  "+3%",
  "+4%",
  "+5%",
  "+6%",
  "+7%",
  "+8%",
  "+9%",
  "+10%",
  "+11%",
  "+12%",
  "+13%",
  "+14%",
  "+15%",
  "+16%",
  "+17%",
  "+18%",
  "+19%",
  "+20%",
  "+21%",
  "+22%",
  "+23%",
  "+24%",
  "+25%",
  "+26%",
  "+27%",
  "+28%",
  "+29%",
  "+30%",
  "+31%",
  "+32%",
  "+33%",
  "+34%",
  "+35%",
  "+36%",
  "+37%",
  "+38%",
  "+39%",
  "+40%",
  "+41%",
  "+42%",
  "+43%",
  "+44%",
  "+45%",
  "+46%",
  "+47%",
  "+48%",
  "+49%",
  "+50%",
  "+51%",
  "+52%",
  "+53%",
  "+54%",
  "+55%",
  "+56%",
  "+57%",
  "+58%",
  "+59%",
  "+60%",
  "+61%",
  "+62%",
  "+63%",
  "+64%",
  "+65%",
  "+66%",
  "+67%",
  "+68%",
  "+69%",
  "+70%",
  "+71%",
  "+72%",
  "+73%",
  "+74%",
  "+75%",
  "+76%",
  "+77%",
  "+78%",
  "+79%",
  "+80%",
  "+81%",
  "+82%",
  "+83%",
  "+84%",
  "+85%",
  "+86%",
  "+87%",
  "+88%",
  "+89%",
  "+90%",
  "+91%",
  "+92%",
  "+93%",
  "+94%",
  "+95%",
  "+96%",
  "+97%",
  "+98%",
  "+99%",
  "+100%",
];

// 翻译映射
const cnMapping = {
  "Movement Speed": "移动速度",
  "Attack Speed": "攻击速度",
  "Cast Speed": "施法速度",
  "Critical Strike Rating": "暴击值",
  "Critical Strike Damage": "暴击伤害",
  "Life Regeneration Speed": "生命回复速度",
  "Mana Regeneration Speed": "魔力回复速度",
  "Max Life": "最大生命",
  "Max Mana": "最大魔力",
  "Max Energy Shield": "最大护盾",
  "Fire Resistance": "火焰抗性",
  "Cold Resistance": "冰冷抗性",
  "Lightning Resistance": "闪电抗性",
  "Erosion Resistance": "腐蚀抗性",
  "Elemental Resistance": "元素抗性",
  Armor: "护甲",
  Evasion: "闪避",
  "Block Chance": "格挡几率",
  "Spell Block Chance": "法术格挡几率",
  "Attack Block Chance": "攻击格挡几率",
  "Physical Damage": "物理伤害",
  "Fire Damage": "火焰伤害",
  "Cold Damage": "冰冷伤害",
  "Lightning Damage": "闪电伤害",
  "Erosion Damage": "腐蚀伤害",
  "Elemental Damage": "元素伤害",
  "Spell Damage": "法术伤害",
  "Attack Damage": "攻击伤害",
  "Melee Damage": "近战伤害",
  "Minion Damage": "召唤物伤害",
  "Cooldown Recovery Speed": "冷却回复速度",
  "Skill Effect Duration": "技能效果持续时间",
  "Skill Area": "技能范围",
  "Ailment Duration": "异常状态持续时间",
  "Deterioration Damage": "恶化伤害",
  "Trauma Damage": "创伤伤害",
  "Wilt Damage": "凋零伤害",
  "Ignite Damage": "点燃伤害",
};

// 生成翻译
let added = 0;

percentages.forEach((pct) => {
  statTypes.forEach((stat) => {
    const en = pct + " " + stat;
    const cnPct = pct.replace("+", "+");
    const cnStat = cnMapping[stat];

    if (!translations[en] && cnStat) {
      translations[en] = cnPct + " " + cnStat;
      added++;
    }
  });
});

console.log("生成的翻译数量:", added);

// 排序并保存
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((e) => {
  result[e[0]] = e[1];
});
fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);

console.log("总计:", Object.keys(result).length, "条翻译");
