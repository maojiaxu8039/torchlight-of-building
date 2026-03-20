# Lingui 翻译问题排查指南

## 问题描述

在 Torchlight of Building 项目中，使用 `i18n._()` 渲染的文本在点击"简体中文/English"按钮切换语言时，部分文本不更新。

## 根本原因

`i18n._()` 是一个纯函数调用，不会自动订阅语言变化。当组件没有因为 props/state 变化而重新渲染时，`i18n._()` 的结果不会更新。

### 对比：生效 vs 不生效

| 调用方式 | 语言切换是否生效 |
|---------|----------------|
| `<Trans>Text</Trans>` | ✅ 生效 |
| `<StatLine label={i18n._("Text")} />` (props) | ✅ 生效 (父组件重渲染时) |
| `{i18n._("Text")}` (静态文本) | ❌ 不生效 |

## 解决方案

### 方案一：使用 `<Trans>` 组件（推荐）

```tsx
import { Trans } from "@lingui/react/macro";

// 替换
{i18n._("Configure combat conditions and buff stacks for damage calculations.")}

// 改为
<Trans>Configure combat conditions and buff stacks for damage calculations.</Trans>
```

### 方案二：监听 locale-changed 事件

如果必须使用 `i18n._()`，在组件中添加事件监听：

```tsx
import { useState, useEffect } from "react";
import { i18n } from "@/src/lib/i18n";

export const MyComponent: React.FC<Props> = ({ ... }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLocaleChange = () => {
      forceUpdate({});
    };
    window.addEventListener("locale-changed", handleLocaleChange);
    return () => {
      window.removeEventListener("locale-changed", handleLocaleChange);
    };
  }, []);

  return (
    <div>
      {/* 这里使用 i18n._() 会正确响应语言切换 */}
      {i18n._("Configure combat conditions and buff stacks for damage calculations.")}
    </div>
  );
};
```

### 方案三：提取为独立组件

将翻译文本作为 props 传入独立组件，利用 React 重渲染机制：

```tsx
const DescriptionText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return <p className={className}>{text}</p>;
};

// 使用
<DescriptionText
  text={i18n._("Configure combat conditions and buff stacks for damage calculations.")}
  className="mt-1 text-sm text-zinc-400"
/>
```

## .po 文件配置

确保需要翻译的文本在 `.po` 文件中有正确的 `#. js-lingui-explicit-id` 注释：

```po
#. js-lingui-explicit-id
#: src/components/xxx/Component.tsx:123
msgid "Text to translate"
msgstr "翻译后的文本"
```

### 注意

- 有 `#. js-lingui-explicit-id` 注释 → 使用 msgid 作为 key
- 没有注释 → 使用 hash key（可能导致 zh/en 不一致）

## 排查步骤

1. **检查 .po 文件**：确认翻译存在且正确
2. **检查 .ts/.js 编译文件**：确认 msgid 对应的翻译正确
3. **检查代码调用方式**：是 `<Trans>` 还是 `i18n._()`
4. **检查组件是否重渲染**：组件是否有 props/state 变化触发重渲染
5. **添加事件监听**：如果组件不重渲染，添加 `locale-changed` 事件监听

## 本次修复记录

- 文件：`src/components/configuration/ConfigurationTab.tsx`
- 问题：`Configure combat conditions and buff stacks for damage calculations.` 文本在语言切换时不更新
- 解决方案：添加 `useEffect` 监听 `locale-changed` 事件，触发 forceUpdate 强制重渲染

```tsx
const [, forceUpdate] = useState({});

useEffect(() => {
  const handleLocaleChange = () => {
    forceUpdate({});
  };
  window.addEventListener("locale-changed", handleLocaleChange);
  return () => {
    window.removeEventListener("locale-changed", handleLocaleChange);
  };
}, []);
```
