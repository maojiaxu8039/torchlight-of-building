# 装备词缀翻译数据

本目录包含从 [tlidb.com](https://tlidb.com) 网站抓取的中英文词缀翻译对照数据。

## 📁 文件结构

```
translated-affixes/
├── belt.json                      # 腰带词缀翻译
├── boots.json                     # 靴子词缀翻译
├── chest.json                     # 胸甲词缀翻译
├── claw.json                      # 爪类武器词缀翻译
├── crossbow.json                  # 弩类武器词缀翻译
├── dagger.json                    # 匕首词缀翻译
├── fire_cannon.json               # 火炮词缀翻译
├── gloves.json                    # 手套词缀翻译
├── helmet.json                    # 头盔词缀翻译
├── necklace.json                  # 项链词缀翻译
├── one-handed_axe.json            # 单手斧词缀翻译
├── one-handed_hammer.json         # 单手锤词缀翻译
├── one-handed_sword.json          # 单手剑词缀翻译
├── pistol.json                    # 手枪词缀翻译
├── ring.json                      # 戒指词缀翻译
├── rod.json                       # 法杖词缀翻译
├── scepter.json                   # 权杖词缀翻译
├── shield.json                    # 盾牌词缀翻译
├── staff.json                     # 法杖词缀翻译
├── two-handed_axe.json            # 双手斧词缀翻译
├── two-handed_hammer.json         # 双手锤词缀翻译
├── two-handed_sword.json          # 双手剑词缀翻译
├── wand.json                      # 魔杖词缀翻译
├── all-affix-translations.json    # 所有装备类型的完整翻译数据
├── unique-translations.json       # 去重后的唯一翻译对照
├── affix-name-translations.ts      # 所有词缀名称翻译（包含复杂前缀后缀）
└── core-stat-translations.ts       # ✅ 核心属性名称翻译（推荐使用）
```

## 📊 数据统计

- **成功抓取的装备类型**: 21 个
- **总词缀记录数**: 8,161 条
- **唯一词缀数**: 7,893 条
- **核心属性名称翻译**: 74 条

## 🎯 使用方法

### 方法一：使用核心属性翻译（推荐）

```typescript
import { AFFIX_NAME_TRANSLATIONS, getAffixNameTranslation } from './core-stat-translations';

// 简单查询
const cnText = AFFIX_NAME_TRANSLATIONS['max energy shield'];
// 输出: "最大护盾"

// 安全的查询方法（未找到时返回原文本）
const translated = getAffixNameTranslation('Critical Strike Rating');
// 输出: "暴击率"

const notFound = getAffixNameTranslation('Unknown Stat');
// 输出: "Unknown Stat"
```

### 方法二：查询完整词缀翻译

```typescript
import affixData from './all-affix-translations.json';

const beltAffixes = affixData.find(item => item.equipmentType === 'Belt');
console.log(beltAffixes);
// {
//   equipmentType: 'Belt',
//   affixes: [
//     {
//       modifierId: '51531811',
//       enText: '+(150-400) Max Energy Shield',
//       cnText: '+(150-400) 最大护盾'
//     },
//     ...
//   ]
// }
```

## 🔄 重新抓取数据

如需更新翻译数据，请运行以下命令：

```bash
# 1. 抓取所有装备类型的词缀翻译
npx tsx scripts/scrape-affix-translations.ts

# 2. 生成核心属性翻译文件
npx tsx scripts/extract-core-stat-translations.ts
```

## 📝 数据格式说明

### all-affix-translations.json

```typescript
interface EquipmentAffixTranslations {
  equipmentType: string;      // 装备类型名称（如 "Belt"）
  affixes: Array<{
    modifierId: string;      // 词缀唯一 ID
    enText: string;          // 英文原文
    cnText: string;          // 中文翻译
  }>;
}
```

### core-stat-translations.ts

```typescript
// 翻译映射表
export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
  'max energy shield': '最大护盾',
  'max life': '最大生命',
  // ... 共 74 条
};

// 查询函数
export const getAffixNameTranslation = (enName: string): string => {
  // 未找到时返回原文本
  return AFFIX_NAME_TRANSLATIONS[enName.toLowerCase()] ?? enName;
};
```

## ⚠️ 注意事项

1. **数据来源**: 所有数据均来自 tlidb.com 网站
2. **自动生成**: 翻译文件为自动生成，请勿手动编辑
3. **更新频率**: 建议在游戏版本更新后重新抓取
4. **数据完整性**: 部分装备类型（如 Boots, Helmet, Gloves, Chest, Staff）可能因 URL 格式不同未被抓取

## 🛠️ 抓取脚本说明

### scrape-affix-translations.ts

- 抓取 tlidb.com 上所有装备类型的 EN 和 CN 页面
- 通过 `data-modifier-id` 匹配提取词缀翻译
- 生成独立的 JSON 文件和汇总文件

### extract-core-stat-translations.ts

- 从完整词缀文本中提取核心属性名称
- 生成 TypeScript 翻译映射文件
- 包含常用属性名称的手动翻译补充

## 📦 依赖

- `cheerio` - HTML 解析库
- `tsx` - TypeScript 执行器

## 📅 生成时间

最后更新时间: 2026-03-23
