# tlidb.com 词缀翻译完整抓取流程

## 一、系统概述

本系统通过抓取 tlidb.com 网站的英文和中文页面，自动获取游戏词缀的中文翻译。

### 1.1 核心目标

1. **保持现有功能**：gear-affix/*.ts 格式不变
2. **自动获取中文翻译**：通过 EN→CN 匹配
3. **精确匹配**：使用 data-modifier-id 进行匹配

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            数据来源                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   tlidb.com/en/{type} ──────────► 英文页面 HTML                               │
│   tlidb.com/cn/{type} ──────────► 中文页面 HTML                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       第一步：本地 HTML 缓存生成                               │
│                    (src/scripts/generate-gear-affix-data.ts)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. 抓取英文网站 HTML 并保存到本地                                         │
│      .garbage/tlidb/gear/{type}.html                                       │
│                                                                             │
│   2. 解析 HTML 提取词缀数据                                                │
│      - data-modifier-id                                                   │
│      - tier (来自 data-tier 属性)                                          │
│      - craftableAffix (词缀文本)                                          │
│                                                                             │
│   3. 生成 gear-affix/*.ts 文件                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       第二步：翻译抓取脚本                                   │
│                      (scripts/gen-trans-clean-final.cjs)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. 从 tlidb.com 在线抓取中文页面                                          │
│      https://tlidb.com/cn/{type}                                          │
│                                                                             │
│   2. 解析 HTML，提取 data-modifier-id 和词缀文本                            │
│                                                                             │
│   3. 通过 data-modifier-id 匹配 EN ↔ CN                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       第三步：生成翻译表                                     │
│               (src/data/translated-affixes/complete-affix-translations.ts)    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   翻译表格式:                                                             │
│   { "modifierId": "中文翻译" }                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       第四步：翻译函数                                      │
│                         (src/lib/affix-translator.ts)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   export function getTranslatedAffixText(modifierId: string): string {    │
│     if (AFFIX_TRANSLATIONS[modifierId]) {                                 │
│       return AFFIX_TRANSLATIONS[modifierId];                              │
│     }                                                                     │
│     return "";                                                           │
│   }                                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、HTML 结构分析

### 2.1 英文网站 HTML 结构

```html
<tr data-tier="2">
  <td>
    <span data-modifier-id="123456">+(54-74) Max Life</span>
    <i class="fa-solid fa-circle-info" data-bs-toggle="tooltip" 
       data-bs-title="Tier: 2, Level: 1, Weight: 1"></i>
  </td>
  <td>1</td>  <!-- Tier -->
  <td>1</td>  <!-- Weight -->
</tr>
```

### 2.2 中文网站 HTML 结构

```html
<tr data-tier="2">
  <td>
    <span data-modifier-id="123456">+(54-74) 最大生命</span>
    <i class="fa-solid fa-circle-info" ...></i>
  </td>
  <td>1</td>
  <td>1</td>
</tr>
```

### 2.3 嵌套 HTML 标签问题

某些词缀包含嵌套的 `<span>` 标签：

```html
<span data-modifier-id="140520600">
  <span class="text-mod">+2</span> 物理技能等级
</span>
```

**解决方案**：使用正则表达式正确提取嵌套标签内的完整文本。

---

## 三、URL 映射表（38 个装备类型）

| # | 显示名称 | 英文 URL | 中文 URL |
|---|---------|----------|----------|
| 1 | Belt | /en/Belt | /cn/Belt |
| 2 | Boots (DEX) | /en/DEX_Boots | /cn/DEX_Boots |
| 3 | Boots (INT) | /en/INT_Boots | /cn/INT_Boots |
| 4 | Boots (STR) | /en/STR_Boots | /cn/STR_Boots |
| 5 | Bow | /en/Bow | /cn/Bow |
| 6 | Cane | /en/Cane | /cn/Cane |
| 7 | Chest Armor (DEX) | /en/DEX_Chest_Armor | /cn/DEX_Chest_Armor |
| 8 | Chest Armor (INT) | /en/INT_Chest_Armor | /cn/INT_Chest_Armor |
| 9 | Chest Armor (STR) | /en/STR_Chest_Armor | /cn/STR_Chest_Armor |
| 10 | Claw | /en/Claw | /cn/Claw |
| 11 | Crossbow | /en/Crossbow | /cn/Crossbow |
| 12 | Cudgel | /en/Cudgel | /cn/Cudgel |
| 13 | Dagger | /en/Dagger | /cn/Dagger |
| 14 | Fire Cannon | /en/Fire_Cannon | /cn/Fire_Cannon |
| 15 | Gloves (DEX) | /en/DEX_Gloves | /cn/DEX_Gloves |
| 16 | Gloves (INT) | /en/INT_Gloves | /cn/INT_Gloves |
| 17 | Gloves (STR) | /en/STR_Gloves | /cn/STR_Gloves |
| 18 | Helmet (DEX) | /en/DEX_Helmet | /cn/DEX_Helmet |
| 19 | Helmet (INT) | /en/INT_Helmet | /cn/INT_Helmet |
| 20 | Helmet (STR) | /en/STR_Helmet | /cn/STR_Helmet |
| 21 | Musket | /en/Musket | /cn/Musket |
| 22 | Necklace | /en/Necklace | /cn/Necklace |
| 23 | One-Handed Axe | /en/One-Handed_Axe | /cn/One-Handed_Axe |
| 24 | One-Handed Hammer | /en/One-Handed_Hammer | /cn/One-Handed_Hammer |
| 25 | One-Handed Sword | /en/One-Handed_Sword | /cn/One-Handed_Sword |
| 26 | Pistol | /en/Pistol | /cn/Pistol |
| 27 | Ring | /en/Ring | /cn/Ring |
| 28 | Rod | /en/Rod | /cn/Rod |
| 29 | Scepter | /en/Scepter | /cn/Scepter |
| 30 | Shield (DEX) | /en/DEX_Shield | /cn/DEX_Shield |
| 31 | Shield (INT) | /en/INT_Shield | /cn/INT_Shield |
| 32 | Shield (STR) | /en/STR_Shield | /cn/STR_Shield |
| 33 | Spirit Ring | /en/Spirit_Ring | /cn/Spirit_Ring |
| 34 | Tin Staff | /en/Tin_Staff | /cn/Tin_Staff |
| 35 | Two-Handed Axe | /en/Two-Handed_Axe | /cn/Two-Handed_Axe |
| 36 | Two-Handed Hammer | /en/Two-Handed_Hammer | /cn/Two-Handed_Hammer |
| 37 | Two-Handed Sword | /en/Two-Handed_Sword | /cn/Two-Handed_Sword |
| 38 | Wand | /en/Wand | /cn/Wand |

---

## 四、匹配逻辑详解

### 4.1 匹配方式：data-modifier-id

```typescript
// 英文页面
const enData = {
  "123456": "+(54-74) Max Life",
  "123457": "+(40-60) Max Mana",
};

// 中文页面
const cnData = {
  "123456": "+(54-74) 最大生命",
  "123457": "+(40-60) 最大魔力",
};

// 通过 ID 匹配
const translations = {};
for (const [id, enText] of Object.entries(enData)) {
  if (cnData[id]) {
    translations[id] = cnData[id];
  }
}

// 结果
// { "123456": "+(54-74) 最大生命", "123457": "+(40-60) 最大魔力" }
```

### 4.2 HTML 解析正则表达式

```javascript
// 提取 data-modifier-id 和词缀文本
const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<td|data-modifier-id=|$)/gi;

// 处理嵌套 span 的 cleanText 函数
function cleanText(text) {
  let result = text;

  // 移除 tooltip 属性
  result = result.replace(/data-bs-title="[^"]*"/gi, "");
  result = result.replace(/data-bs-html="[^"]*"/gi, "");

  // 提取嵌套 span 的完整内容
  let parts = [];

  // 匹配 <span data-modifier-id=...><...></span><td>
  const modSpanRegex = /<span[^>]*data-modifier-id[^>]*>([\s\S]*?)<\/span>\s*<td>/gi;
  let m;
  while ((m = modSpanRegex.exec(result))) {
    let content = m[1];
    content = content.replace(/<[^>]+>/g, ' ');
    content = content.replace(/\s+/g, ' ').trim();
    if (content) {
      parts.push(content);
    }
  }

  // 如果没有匹配到，尝试匹配到 <td> 之前
  if (parts.length === 0) {
    const altRegex = /data-modifier-id[^>]*>([\s\S]*?)<td>/gi;
    while ((m = altRegex.exec(result))) {
      let content = m[1];
      content = content.replace(/<[^>]+>/g, ' ');
      content = content.replace(/\s+/g, ' ').trim();
      if (content) {
        parts.push(content);
      }
    }
  }

  if (parts.length > 0) {
    result = parts.join(' ');
  } else {
    result = result.replace(/<[^>]+>/g, ' ');
  }

  // 清理其他标签和实体
  result = result.replace(/<div[^>]*>/gi, " ");
  result = result.replace(/<br\s*\/?>/gi, " ");
  result = result.replace(/<i[^>]*>.*?<\/i>/gi, "");
  result = result.replace(/&nbsp;/g, " ");
  result = result.replace(/&ndash;/g, "-");

  return result.replace(/\s+/g, ' ').trim();
}
```

---

## 五、执行命令

### 5.1 缓存 HTML 并生成词缀文件

```bash
pnpm exec tsx src/scripts/generate-gear-affix-data.ts --refetch
```

### 5.2 抓取翻译数据（需要联网）

```bash
node scripts/gen-trans-clean-final.cjs
```

### 5.3 检查匹配率

```bash
node scripts/analyze-matching.cjs
```

### 5.4 编译国际化文件

```bash
pnpm lingui:compile
```

---

## 六、数据文件说明

### 6.1 HTML 缓存文件

```
.garbage/tlidb/gear/*.html
```

| 文件 | 说明 |
|------|------|
| `belt.html` | Belt 装备的英文页面 HTML |
| `bow.html` | Bow 装备的英文页面 HTML |
| ... | ... |

### 6.2 词缀数据文件

```
src/data/gear-affix/*.ts
```

格式：

```typescript
export const BELT_BASE_AFFIX_AFFIXES: readonly BaseGearAffix[] = [
  {
    equipmentSlot: "Trinket",
    equipmentType: "Belt",
    affixType: "Base Affix",
    craftingPool: "",
    tier: "2",
    craftableAffix: "+(54-74) Max Life",
  },
];
```

### 6.3 翻译表

```
src/data/translated-affixes/complete-affix-translations.ts
```

格式：

```typescript
export const AFFIX_TRANSLATIONS: Record<string, string> = {
  "123456": "+(54-74) 最大生命",
  "123457": "+(40-60) 最大魔力",
} as const;

export const AFFIX_NAME_TRANSLATIONS = AFFIX_TRANSLATIONS;
```

---

## 七、统计信息

### 7.1 最新抓取结果

| 指标 | 数量 |
|------|------|
| 装备类型 | 38 个 |
| HTML 缓存 | 38 个 |
| 总 EN 词缀 | 15,465 条 |
| 总 CN 词缀 | 15,465 条 |
| 匹配成功 | 15,463 条 |
| **匹配率** | **100%** |

### 7.2 gear-affix/*.ts 覆盖率

| 词缀类型 | 数量 | 匹配率 |
|---------|------|--------|
| Base Affix | 714 | 100% |
| Prefix | 3,037 | 100% |
| Suffix | 2,873 | 100% |
| Sweet Dream Affix | 709 | 100% |
| Tower Sequence | 408 | 100% |
| **总计** | **7,741** | **100%** |

---

## 八、关键脚本文件

| 文件 | 说明 |
|------|------|
| `src/scripts/generate-gear-affix-data.ts` | 解析 HTML，生成词缀文件 |
| `scripts/gen-trans-clean-final.cjs` | 抓取翻译数据 |
| `scripts/analyze-matching.cjs` | 检查翻译匹配率 |
| `src/lib/affix-translator.ts` | 翻译函数 |
| `src/lib/affix-utils.ts` | 词缀工具函数 |

---

## 九、问题排查

### 9.1 常见问题

1. **翻译不完整**：某些词缀只显示部分翻译
   - 原因：嵌套的 `<span>` 标签解析不正确
   - 解决：更新 `cleanText` 函数

2. **匹配率下降**：匹配数量减少
   - 原因：正则表达式过于严格
   - 解决：检查 `parseAffixes` 函数中的正则表达式

3. **HTML 缓存过期**：网站更新后缓存未刷新
   - 解决：使用 `--refetch` 参数重新抓取

### 9.2 调试方法

```bash
# 测试特定 ID 的翻译
node -e "const t = require('./src/data/translated-affixes/complete-affix-translations.ts'); console.log(t.AFFIX_TRANSLATIONS['140520600']);"

# 检查 HTML 结构
node scripts/debug-span.cjs
```

---

## 十、版本历史

### v1.0 - 初始版本
- 使用纯文本匹配
- 匹配率约 60%

### v2.0 - data-modifier-id 匹配
- 使用 ID 进行精确匹配
- 匹配率达到 100%

### v3.0 - 嵌套 HTML 标签处理
- 修复嵌套 `<span>` 标签问题
- 支持 "Physical Skill Level" 等复合词缀

---

## 十一、工作流程图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           完整工作流程                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. 生成英文词缀数据                                                      │
│      tlidb.com/en/* → .garbage/tlidb/gear/*.html                          │
│      ↓                                                                  │
│      generate-gear-affix-data.ts                                         │
│      ↓                                                                  │
│      src/data/gear-affix/*.ts                                            │
│                                                                             │
│   2. 抓取中文翻译                                                        │
│      tlidb.com/cn/* → 解析 HTML                                          │
│      ↓                                                                  │
│      gen-trans-clean-final.cjs                                           │
│      ↓                                                                  │
│      匹配 EN ↔ CN                                                       │
│                                                                             │
│   3. 生成翻译表                                                          │
│      complete-affix-translations.ts                                       │
│                                                                             │
│   4. 应用翻译                                                            │
│      affix-translator.ts → Craft New Item 页面                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
