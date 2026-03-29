const fs = require("fs");
const path = require("path");

const EQUIPMENT_URLS = [
  {
    displayName: "Belt",
    enUrl: "https://tlidb.com/en/Belt",
    cnUrl: "https://tlidb.com/cn/Belt",
  },
  {
    displayName: "Boots (DEX)",
    enUrl: "https://tlidb.com/en/DEX_Boots",
    cnUrl: "https://tlidb.com/cn/DEX_Boots",
  },
  {
    displayName: "Boots (INT)",
    enUrl: "https://tlidb.com/en/INT_Boots",
    cnUrl: "https://tlidb.com/cn/INT_Boots",
  },
  {
    displayName: "Boots (STR)",
    enUrl: "https://tlidb.com/en/STR_Boots",
    cnUrl: "https://tlidb.com/cn/STR_Boots",
  },
  {
    displayName: "Bow",
    enUrl: "https://tlidb.com/en/Bow",
    cnUrl: "https://tlidb.com/cn/Bow",
  },
  {
    displayName: "Cane",
    enUrl: "https://tlidb.com/en/Cane",
    cnUrl: "https://tlidb.com/cn/Cane",
  },
  {
    displayName: "Chest Armor (DEX)",
    enUrl: "https://tlidb.com/en/DEX_Chest_Armor",
    cnUrl: "https://tlidb.com/cn/DEX_Chest_Armor",
  },
  {
    displayName: "Chest Armor (INT)",
    enUrl: "https://tlidb.com/en/INT_Chest_Armor",
    cnUrl: "https://tlidb.com/cn/INT_Chest_Armor",
  },
  {
    displayName: "Chest Armor (STR)",
    enUrl: "https://tlidb.com/en/STR_Chest_Armor",
    cnUrl: "https://tlidb.com/cn/STR_Chest_Armor",
  },
  {
    displayName: "Claw",
    enUrl: "https://tlidb.com/en/Claw",
    cnUrl: "https://tlidb.com/cn/Claw",
  },
  {
    displayName: "Crossbow",
    enUrl: "https://tlidb.com/en/Crossbow",
    cnUrl: "https://tlidb.com/cn/Crossbow",
  },
  {
    displayName: "Cudgel",
    enUrl: "https://tlidb.com/en/Cudgel",
    cnUrl: "https://tlidb.com/cn/Cudgel",
  },
  {
    displayName: "Dagger",
    enUrl: "https://tlidb.com/en/Dagger",
    cnUrl: "https://tlidb.com/cn/Dagger",
  },
  {
    displayName: "Fire Cannon",
    enUrl: "https://tlidb.com/en/Fire_Cannon",
    cnUrl: "https://tlidb.com/cn/Fire_Cannon",
  },
  {
    displayName: "Gloves (DEX)",
    enUrl: "https://tlidb.com/en/DEX_Gloves",
    cnUrl: "https://tlidb.com/cn/DEX_Gloves",
  },
  {
    displayName: "Gloves (INT)",
    enUrl: "https://tlidb.com/en/INT_Gloves",
    cnUrl: "https://tlidb.com/cn/INT_Gloves",
  },
  {
    displayName: "Gloves (STR)",
    enUrl: "https://tlidb.com/en/STR_Gloves",
    cnUrl: "https://tlidb.com/cn/STR_Gloves",
  },
  {
    displayName: "Helmet (DEX)",
    enUrl: "https://tlidb.com/en/DEX_Helmet",
    cnUrl: "https://tlidb.com/cn/DEX_Helmet",
  },
  {
    displayName: "Helmet (INT)",
    enUrl: "https://tlidb.com/en/INT_Helmet",
    cnUrl: "https://tlidb.com/cn/INT_Helmet",
  },
  {
    displayName: "Helmet (STR)",
    enUrl: "https://tlidb.com/en/STR_Helmet",
    cnUrl: "https://tlidb.com/cn/STR_Helmet",
  },
  {
    displayName: "Musket",
    enUrl: "https://tlidb.com/en/Musket",
    cnUrl: "https://tlidb.com/cn/Musket",
  },
  {
    displayName: "Necklace",
    enUrl: "https://tlidb.com/en/Necklace",
    cnUrl: "https://tlidb.com/cn/Necklace",
  },
  {
    displayName: "One-Handed Axe",
    enUrl: "https://tlidb.com/en/One-Handed_Axe",
    cnUrl: "https://tlidb.com/cn/One-Handed_Axe",
  },
  {
    displayName: "One-Handed Hammer",
    enUrl: "https://tlidb.com/en/One-Handed_Hammer",
    cnUrl: "https://tlidb.com/cn/One-Handed_Hammer",
  },
  {
    displayName: "One-Handed Sword",
    enUrl: "https://tlidb.com/en/One-Handed_Sword",
    cnUrl: "https://tlidb.com/cn/One-Handed_Sword",
  },
  {
    displayName: "Pistol",
    enUrl: "https://tlidb.com/en/Pistol",
    cnUrl: "https://tlidb.com/cn/Pistol",
  },
  {
    displayName: "Ring",
    enUrl: "https://tlidb.com/en/Ring",
    cnUrl: "https://tlidb.com/cn/Ring",
  },
  {
    displayName: "Rod",
    enUrl: "https://tlidb.com/en/Rod",
    cnUrl: "https://tlidb.com/cn/Rod",
  },
  {
    displayName: "Scepter",
    enUrl: "https://tlidb.com/en/Scepter",
    cnUrl: "https://tlidb.com/cn/Scepter",
  },
  {
    displayName: "Shield (DEX)",
    enUrl: "https://tlidb.com/en/DEX_Shield",
    cnUrl: "https://tlidb.com/cn/DEX_Shield",
  },
  {
    displayName: "Shield (INT)",
    enUrl: "https://tlidb.com/en/INT_Shield",
    cnUrl: "https://tlidb.com/cn/INT_Shield",
  },
  {
    displayName: "Shield (STR)",
    enUrl: "https://tlidb.com/en/STR_Shield",
    cnUrl: "https://tlidb.com/cn/STR_Shield",
  },
  {
    displayName: "Spirit Ring",
    enUrl: "https://tlidb.com/en/Spirit_Ring",
    cnUrl: "https://tlidb.com/cn/Spirit_Ring",
  },
  {
    displayName: "Tin Staff",
    enUrl: "https://tlidb.com/en/Tin_Staff",
    cnUrl: "https://tlidb.com/cn/Tin_Staff",
  },
  {
    displayName: "Two-Handed Axe",
    enUrl: "https://tlidb.com/en/Two-Handed_Axe",
    cnUrl: "https://tlidb.com/cn/Two-Handed_Axe",
  },
  {
    displayName: "Two-Handed Hammer",
    enUrl: "https://tlidb.com/en/Two-Handed_Hammer",
    cnUrl: "https://tlidb.com/cn/Two-Handed_Hammer",
  },
  {
    displayName: "Two-Handed Sword",
    enUrl: "https://tlidb.com/en/Two-Handed_Sword",
    cnUrl: "https://tlidb.com/cn/Two-Handed_Sword",
  },
  {
    displayName: "Wand",
    enUrl: "https://tlidb.com/en/Wand",
    cnUrl: "https://tlidb.com/cn/Wand",
  },
];

const scriptsDir = __dirname;

const mdContent = `# Equipment Type 与 tlidb.com URL 匹配表

## 抓取脚本使用的 Equipment Type 名称与 URL 对照

| # | Equipment Type (显示名称) | 英文 URL | 中文 URL |
|---|------------------------|----------|----------|
${EQUIPMENT_URLS.map((item, idx) => `| ${idx + 1} | ${item.displayName} | ${item.enUrl} | ${item.cnUrl} |`).join("\n")}

## 统计信息

- **总计**: ${EQUIPMENT_URLS.length} 个装备类型
- **分类**:
  - 护甲: 9 个 (Boots x3, Gloves x3, Helmet x3)
  - 胸甲: 3 个 (DEX, INT, STR)
  - 盾牌: 3 个 (DEX, INT, STR)
  - 远程武器: 4 个 (Bow, Crossbow, Musket, Pistol)
  - 法杖类: 5 个 (Wand, Rod, Scepter, Cane, Tin Staff)
  - 近战武器: 7 个 (Dagger, Claw, Cudgel, One-Handed Sword/Axe/Hammer, Two-Handed Sword/Axe/Hammer)
  - 火炮: 1 个 (Fire Cannon)
  - 饰品: 4 个 (Ring, Necklace, Belt, Spirit Ring)

## 代码中使用

\`\`\`javascript
const EQUIPMENT_TYPES = [
  { type: "Belt", url: "Belt" },
  { type: "DEX_Boots", url: "DEX_Boots" },
  { type: "Boots (DEX)", url: "DEX_Boots" },
  // ...
];
\`\`\`
`;

fs.writeFileSync(
  path.join(scriptsDir, "equipment-url-mapping.md"),
  mdContent,
  "utf-8",
);
console.log("✅ Generated equipment-url-mapping.md");

const jsonOutput = {
  totalCount: EQUIPMENT_URLS.length,
  equipmentTypes: EQUIPMENT_URLS,
};

fs.writeFileSync(
  path.join(scriptsDir, "equipment-url-mapping.json"),
  JSON.stringify(jsonOutput, null, 2),
  "utf-8",
);
console.log("✅ Generated equipment-url-mapping.json");

console.log("\n📊 表格预览:\n");
console.log("| # | Equipment Type | EN URL | CN URL |");
console.log("|---|----------------|--------|--------|");
EQUIPMENT_URLS.forEach((item, idx) => {
  console.log(
    `| ${idx + 1} | ${item.displayName} | ${item.enUrl.replace("https://tlidb.com/en/", "")} | ${item.cnUrl.replace("https://tlidb.com/cn/", "")} |`,
  );
});
