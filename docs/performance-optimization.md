# 性能优化报告

## 一、性能分析总结

### 1.1 Bundle 大小分析

**当前问题**：`index.js` 体积 **5,234 KB** (gzip: 784 KB)

| 文件 | 大小 | 说明 |
|------|------|------|
| `index.js` | 5,234 KB | ⚠️ 过大 |
| `common.js` | 21 KB | ✅ 可接受 |
| `skills.js` | 35 KB | ✅ 可接受 |
| `legendaries.js` | 12 KB | ✅ 可接受 |

### 1.2 数据文件大小

| 目录 | 大小 | 文件数 |
|------|------|--------|
| `src/data/gear-affix/` | 2.0 MB | 213 |
| `src/data/vorax/` | ~200 KB | - |
| `src/data/translated-affixes/` | 280 KB | - |
| `src/data/skill/` | 640 KB | - |
| `src/data/talent/` | 76 KB | - |

---

## 二、性能瓶颈识别

### 2.1 主要问题

1. **巨大 Bundle**: `index.js` 包含所有数据
2. **数据未代码分割**: 所有翻译和词缀数据打包在一起
3. **翻译表过大**: `complete-affix-translations.ts` 有 15,073 行

### 2.2 根本原因

```typescript
// 当前导入方式
import { AFFIX_TRANSLATIONS } from "@/data/translated-affixes/complete-affix-translations";
```

所有翻译数据在应用启动时全部加载，即使某些页面不需要。

---

## 三、优化方案

### 3.1 代码分割 (Code Splitting) - 优先级：高

**方案**：使用动态导入，按路由分割数据

```typescript
// 路由级别动态导入
const gearAffixRoute = createFileRouteRoute("/builder/gear");

// 在路由 loader 中动态导入
export const route = {
  loader: async () => {
    const [gearAffixes, translations] = await Promise.all([
      import("@/data/gear-affix/all-affixes"),
      import("@/data/translated-affixes/complete-affix-translations"),
    ]);
    return { gearAffixes, translations };
  },
};
```

### 3.2 数据压缩 - 优先级：高

**方案**：使用更紧凑的数据结构

```typescript
// 当前：字符串作为 key
{ "123456": "+(54-74) 最大生命" }

// 优化后：使用数字索引
const IDS = ["+(54-74) 最大生命", ...];
const TRANSLATIONS = [0, 1, 2, ...]; // 索引数组
```

### 3.3 数据分离 - 优先级：中

**方案**：将大型数据文件移出主 bundle

```
src/data/
├── gear-affix/           # 移入 public/data/
├── translated-affixes/    # 移入 public/data/
└── skill/                # 移入 public/data/
```

### 3.4 懒加载翻译 - 优先级：中

**方案**：按需加载翻译数据

```typescript
// 使用时再加载
const loadTranslation = async (modifierId: string) => {
  const translations = await fetch(`/data/translations/${modifierId.slice(0,2)}.json`);
  return translations[modifierId];
};
```

---

## 四、实施计划

### 第一阶段：立即优化（1-2小时）

| 优化项 | 预期效果 | 复杂度 |
|--------|----------|--------|
| 配置 Vite 代码分割 | -10~20% bundle | 低 |
| 移除未使用的数据目录 | -500KB~1MB | 低 |
| 启用 gzip/brotli 压缩 | -30% 传输大小 | 低 |

### 第二阶段：架构优化（1-2天）

| 优化项 | 预期效果 | 复杂度 |
|--------|----------|--------|
| 路由级别代码分割 | -30~50% 首屏加载 | 中 |
| 数据 JSON 外置 | -1~2MB bundle | 中 |
| Web Worker 解析 | 改善主线程阻塞 | 中 |

### 第三阶段：高级优化（长期）

| 优化项 | 预期效果 | 复杂度 |
|--------|----------|--------|
| IndexedDB 缓存 | 秒级加载 | 高 |
| Service Worker | 离线支持 | 高 |
| 增量更新 | 减少带宽 | 高 |

---

## 五、立即可实施的优化

### 5.1 Vite 配置优化

修改 `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库单独打包
          vendor: ["react", "react-dom", "zustand"],
          router: ["@tanstack/react-router"],
          utils: ["remeda", "ts-pattern", "zod"],
          // 大数据文件单独打包
          translations: [
            "@/data/translated-affixes/complete-affix-translations",
            "@/data/gear-affix",
          ],
        },
      },
    },
    // 压缩
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

### 5.2 检查未使用的数据目录

```bash
# 找出未被导入的目录
grep -r "from.*@/data/\|import.*@/data/" src/routes/ src/components/
```

**发现的未使用目录**：
- `src/data/gear-affix-converted/` (1.8MB) - 可能已废弃
- `src/data/gear-affix-new/` (1.0MB) - 可能已废弃
- `src/data/gear-affix-prefix-suffix/` (236KB) - 可能已废弃

### 5.3 翻译数据外置

将翻译表移出 bundle:

```typescript
// public/data/translations.json
{
  "translations": {
    "123456": "+(54-74) 最大生命"
  }
}

// 按需加载
export const loadTranslations = async () => {
  const data = await fetch("/data/translations.json");
  return data.json();
};
```

---

## 六、性能测试建议

### 6.1 Lighthouse 测试

```bash
# 安装 lighthouse
npm install -g lighthouse

# 测试性能
lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json
```

### 6.2 Bundle 分析

```bash
# 使用 rollup-plugin-visualizer
pnpm add -D rollup-plugin-visualizer
```

### 6.3 监控指标

| 指标 | 当前值 | 目标值 |
|------|--------|--------|
| First Contentful Paint | ~2s | <1s |
| Largest Contentful Paint | ~4s | <2.5s |
| Bundle Size (gzip) | 784 KB | <300 KB |
| Time to Interactive | ~5s | <3s |

---

## 七、总结

### 7.1 优化优先级

1. **高优先级**：移除废弃数据目录（~3MB）
2. **高优先级**：配置 Vite 代码分割
3. **中优先级**：翻译数据外置到 JSON
4. **低优先级**：Web Worker 解析

### 7.2 预期效果

| 优化 | bundle 减少 | 加载时间改善 |
|------|-----------|-------------|
| 移除废弃目录 | ~3MB | 30% |
| 代码分割 | 1-2MB | 50% |
| JSON 外置 | 1.5MB | 40% |
| **总计** | **~5.5MB** | **70%** |

### 7.3 下一步行动

1. ✅ 分析完成
2. ⬜ 确认废弃目录并删除
3. ⬜ 配置 Vite 代码分割
4. ⬜ 实施翻译数据外置
5. ⬜ 测试性能改善
