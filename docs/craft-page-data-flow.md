# Craft New Item 页面数据逻辑分析

## 1. 页面结构

```
Craft New Item 页面
├── Equipment Type 选择 (下拉框)
├── Base Stats 选择 (下拉框)
├── Base Affixes 选择 (2个下拉框)
├── Prefixes 选择 (3个下拉框)
├── Suffixes 选择 (3个下拉框)
├── Sweet Dream Affix 选择
├── Tower Sequence 选择
├── Blend Affix 选择 (仅 Belt)
└── Custom Affix 输入框
```

## 2. Equipment Type 匹配逻辑

### 数据源

- 文件: `src/data/tli/gear-data-types.ts`
- 数据: `EQUIPMENT_TYPES`, `EQUIPMENT_TYPE_LABELS`

### 选择流程

```
用户选择 Equipment Type
    ↓
setSelectedEquipmentType(value)
    ↓
equipmentType 状态更新
    ↓
触发所有词缀过滤 useMemo
```

### 代码位置

```tsx
// EditGearModal.tsx 第 99-101 行
const [selectedEquipmentType, setSelectedEquipmentType] = useState<EquipmentType | undefined>(undefined);

// 第 105 行
const equipmentType = item?.equipmentType ?? selectedEquipmentType;
```

## 3. 下拉框筛选逻辑

### 词缀筛选

```tsx
// EditGearModal.tsx 第 107-145 行
const prefixAffixes = useMemo(
  () => (equipmentType ? getFilteredAffixes(equipmentType, "Prefix") : []),
  [equipmentType],
);

const suffixAffixes = useMemo(
  () => (equipmentType ? getFilteredAffixes(equipmentType, "Suffix") : []),
  [equipmentType],
);
```

### 筛选函数

```tsx
// affix-utils.ts 第 41-48 行
export const getFilteredAffixes = (
  equipmentType: EquipmentType,
  affixType: FilterAffixType,
): BaseGearAffix[] => {
  return ALL_GEAR_AFFIXES.filter(
    (affix) =>
      affix.equipmentType === equipmentType && affix.affixType === affixType,
  );
};
```

### 数据来源

| 词缀类型           | 数据文件                                      | 匹配字段                          |
| -------------- | ----------------------------------------- | ----------------------------- |
| Prefix         | `src/data/gear-affix/*-prefix.ts`         | `equipmentType` + `affixType` |
| Suffix         | `src/data/gear-affix/*-suffix.ts`         | `equipmentType` + `affixType` |
| Base Affix     | `src/data/gear-affix/*-base.ts`           | `equipmentType` + `affixType` |
| Sweet Dream    | `src/data/gear-affix/*-sweet-dream.ts`    | `equipmentType` + `affixType` |
| Tower Sequence | `src/data/gear-affix/*-tower-sequence.ts` | `equipmentType` + `affixType` |
| Blend          | `src/data/gear-affix/blend.ts`            | 仅 `Belt`                      |

## 4. 词缀匹配逻辑

### 词缀数据格式

```typescript
interface BaseGearAffix {
  equipmentSlot: string;      // "Trinket"
  equipmentType: string;     // "Belt"
  affixType: string;         // "Suffix"
  craftingPool: string;      // "Advanced"
  tier: string;             // "1"
  craftableAffix: string;    // "+(10-12)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment"
}
```

### 数据来源

- 文件: `src/data/gear-affix/` 下的各个文件
- 例如: `belt-suffix.ts`, `belt-prefix.ts` 等

### 词缀匹配流程

```
用户选择装备类型
    ↓
getFilteredAffixes(equipmentType, affixType)
    ↓
过滤 ALL_GEAR_AFFIXES
    ↓
返回匹配的 BaseGearAffix[]
    ↓
展示下拉框选项
```

## 5. 翻译逻辑

### 翻译数据源

1. **网页抓取翻译**: `src/data/translated-affixes/merged-all-translations.json`
2. **编译后翻译**: `src/data/translated-affixes/complete-affix-translations.ts`

### 翻译匹配函数

```typescript
// affix-translator.ts
export function getTranslatedAffixText(text: string): string {
  // 1. 精确匹配
  if (AFFIX_NAME_TRANSLATIONS[text]) {
    return AFFIX_NAME_TRANSLATIONS[text];
  }

  // 2. 正则匹配（按长度排序，优先匹配长的）
  const sortedKeys = Object.keys(AFFIX_NAME_TRANSLATIONS)
    .sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    // 使用正则替换
    result = result.replace(regex, replacement);
  }

  return result;
}
```

### 翻译数据来源

| 来源   | URL                                    | 格式                                  |
| ---- | -------------------------------------- | ----------------------------------- |
| 英文网站 | `https://tlidb.com/en/{equipmentType}` | `+(10-12)% Elemental Resistance...` |
| 中文网站 | `https://tlidb.com/cn/{equipmentType}` | `+(10-12)% 元素抗性...`                 |
| 匹配方式 | `data-modifier-id` 相同                  | ID 匹配                               |

## 6. 页面显示逻辑

### 下拉框选项格式

```tsx
// EditGearModal.tsx
options={suffixAffixes.map((affix) => ({
  value: affix.craftableAffix,
  label: getBaseGearNameTranslation(affix.equipmentType),
  sublabel: getTranslatedAffixText(affix.craftableAffix),
}))}
```

### 显示组件

```
SearchableSelect (input)
    ↓
displayValue: opt.label + " " + opt.sublabel
    ↓
显示: "装备名称 翻译后的词缀"
```

### OptionWithTooltip (div)

```
OptionWithTooltip
    ↓
显示: "装备名称 - 翻译后的词缀"
    ↓
使用相同的 getTranslatedAffixText() 函数
```

## 7. 完整数据流程图

```
┌─────────────────────────────────────────────────────────────┐
│                      网页抓取流程                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  https://tlidb.com/en/Belt ─────────────────────────────── │
│           │                                                 │
│           ▼                                                 │
│  提取 data-modifier-id + 词缀文本                          │
│           │                                                 │
│           ▼                                                 │
│  https://tlidb.com/cn/Belt ─────────────────────────────── │
│           │                                                 │
│           ▼                                                 │
│  提取相同的 data-modifier-id + 中文词缀                     │
│           │                                                 │
│           ▼                                                 │
│  通过 ID 匹配 EN ↔ CN                                      │
│           │                                                 │
│           ▼                                                 │
│  保存到 merged-all-translations.json                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      页面渲染流程                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  用户选择 Equipment Type                                    │
│           │                                                 │
│           ▼                                                 │
│  getFilteredAffixes(equipmentType, affixType)             │
│           │                                                 │
│           ▼                                                 │
│  从 ALL_GEAR_AFFIXES 过滤匹配的词缀                       │
│           │                                                 │
│           ▼                                                 │
│  展示下拉框选项 (label + sublabel)                         │
│           │                                                 │
│           ▼                                                 │
│  用户选择词缀                                               │
│           │                                                 │
│           ▼                                                 │
│  getTranslatedAffixText(craftableAffix)                    │
│           │                                                 │
│           ▼                                                 │
│  显示翻译后的词缀                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 8. 关键文件清单

| 文件                               | 说明          |
| -------------------------------- | ----------- |
| `EditGearModal.tsx`              | Craft 页面主组件 |
| `affix-utils.ts`                 | 词缀过滤工具函数    |
| `affix-translator.ts`            | 词缀翻译函数      |
| `gear-data-types.ts`             | 装备类型定义      |
| `complete-affix-translations.ts` | 编译后的翻译数据    |
| `merged-all-translations.json`   | 原始翻译数据      |
| `SearchableSelect.tsx`           | 下拉框组件       |
| `OptionWithTooltip.tsx`          | 悬停显示组件      |

## 9. 当前问题分析

### 问题: input 和 div 显示不一致

**原因分析:**

1. `input` 使用 `options` 中的 `sublabel`
2. `div` 使用 `OptionWithTooltip` 组件
3. 两者都调用 `getTranslatedAffixText()`
4. 但数据源可能不同

**可能的解决方案:**

1. 确保两者使用相同的 `statsText` 数据源
2. 检查翻译文件的完整性
3. 验证正则表达式匹配逻辑

