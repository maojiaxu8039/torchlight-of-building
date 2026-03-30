# Equipment Type 与 tlidb.com URL 匹配表

## 抓取脚本使用的 Equipment Type 名称与 URL 对照

| # | Equipment Type (显示名称) | 英文 URL | 中文 URL |
|---|------------------------|----------|----------|
| 1 | Belt | https://tlidb.com/en/Belt | https://tlidb.com/cn/Belt |
| 2 | Boots (DEX) | https://tlidb.com/en/DEX_Boots | https://tlidb.com/cn/DEX_Boots |
| 3 | Boots (INT) | https://tlidb.com/en/INT_Boots | https://tlidb.com/cn/INT_Boots |
| 4 | Boots (STR) | https://tlidb.com/en/STR_Boots | https://tlidb.com/cn/STR_Boots |
| 5 | Bow | https://tlidb.com/en/Bow | https://tlidb.com/cn/Bow |
| 6 | Cane | https://tlidb.com/en/Cane | https://tlidb.com/cn/Cane |
| 7 | Chest Armor (DEX) | https://tlidb.com/en/DEX_Chest_Armor | https://tlidb.com/cn/DEX_Chest_Armor |
| 8 | Chest Armor (INT) | https://tlidb.com/en/INT_Chest_Armor | https://tlidb.com/cn/INT_Chest_Armor |
| 9 | Chest Armor (STR) | https://tlidb.com/en/STR_Chest_Armor | https://tlidb.com/cn/STR_Chest_Armor |
| 10 | Claw | https://tlidb.com/en/Claw | https://tlidb.com/cn/Claw |
| 11 | Crossbow | https://tlidb.com/en/Crossbow | https://tlidb.com/cn/Crossbow |
| 12 | Cudgel | https://tlidb.com/en/Cudgel | https://tlidb.com/cn/Cudgel |
| 13 | Dagger | https://tlidb.com/en/Dagger | https://tlidb.com/cn/Dagger |
| 14 | Fire Cannon | https://tlidb.com/en/Fire_Cannon | https://tlidb.com/cn/Fire_Cannon |
| 15 | Gloves (DEX) | https://tlidb.com/en/DEX_Gloves | https://tlidb.com/cn/DEX_Gloves |
| 16 | Gloves (INT) | https://tlidb.com/en/INT_Gloves | https://tlidb.com/cn/INT_Gloves |
| 17 | Gloves (STR) | https://tlidb.com/en/STR_Gloves | https://tlidb.com/cn/STR_Gloves |
| 18 | Helmet (DEX) | https://tlidb.com/en/DEX_Helmet | https://tlidb.com/cn/DEX_Helmet |
| 19 | Helmet (INT) | https://tlidb.com/en/INT_Helmet | https://tlidb.com/cn/INT_Helmet |
| 20 | Helmet (STR) | https://tlidb.com/en/STR_Helmet | https://tlidb.com/cn/STR_Helmet |
| 21 | Musket | https://tlidb.com/en/Musket | https://tlidb.com/cn/Musket |
| 22 | Necklace | https://tlidb.com/en/Necklace | https://tlidb.com/cn/Necklace |
| 23 | One-Handed Axe | https://tlidb.com/en/One-Handed_Axe | https://tlidb.com/cn/One-Handed_Axe |
| 24 | One-Handed Hammer | https://tlidb.com/en/One-Handed_Hammer | https://tlidb.com/cn/One-Handed_Hammer |
| 25 | One-Handed Sword | https://tlidb.com/en/One-Handed_Sword | https://tlidb.com/cn/One-Handed_Sword |
| 26 | Pistol | https://tlidb.com/en/Pistol | https://tlidb.com/cn/Pistol |
| 27 | Ring | https://tlidb.com/en/Ring | https://tlidb.com/cn/Ring |
| 28 | Rod | https://tlidb.com/en/Rod | https://tlidb.com/cn/Rod |
| 29 | Scepter | https://tlidb.com/en/Scepter | https://tlidb.com/cn/Scepter |
| 30 | Shield (DEX) | https://tlidb.com/en/DEX_Shield | https://tlidb.com/cn/DEX_Shield |
| 31 | Shield (INT) | https://tlidb.com/en/INT_Shield | https://tlidb.com/cn/INT_Shield |
| 32 | Shield (STR) | https://tlidb.com/en/STR_Shield | https://tlidb.com/cn/STR_Shield |
| 33 | Spirit Ring | https://tlidb.com/en/Spirit_Ring | https://tlidb.com/cn/Spirit_Ring |
| 34 | Tin Staff | https://tlidb.com/en/Tin_Staff | https://tlidb.com/cn/Tin_Staff |
| 35 | Two-Handed Axe | https://tlidb.com/en/Two-Handed_Axe | https://tlidb.com/cn/Two-Handed_Axe |
| 36 | Two-Handed Hammer | https://tlidb.com/en/Two-Handed_Hammer | https://tlidb.com/cn/Two-Handed_Hammer |
| 37 | Two-Handed Sword | https://tlidb.com/en/Two-Handed_Sword | https://tlidb.com/cn/Two-Handed_Sword |
| 38 | Wand | https://tlidb.com/en/Wand | https://tlidb.com/cn/Wand |

## 统计信息

- **总计**: 38 个装备类型
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

```javascript
const EQUIPMENT_TYPES = [
  { type: "Belt", url: "Belt" },
  { type: "DEX_Boots", url: "DEX_Boots" },
  { type: "Boots (DEX)", url: "DEX_Boots" },
  // ...
];
```
