# 全站 More 按钮修复清单

生成时间: 2026-05-21

## 问题原因

首页 About 区正文末尾的 `More>>`、优势区的 `view more` 原先指向 `html/about/index.html`、`html/product/index.html`。`html/` 目录为 HTTrack 镜像时保存的 **nginx 404 占位页**（页面标题为「404 Not Found」），并非公司简介或产品中心，本地打开会显示 404。

全站导航、页脚等已使用正确的 `about/`、`product/` 路径，仅首页这两处仍引用错误的 `html/` 前缀。

## 修复规则

| 场景 | 原链接 | 修改后链接 | 目标页面说明 |
|------|--------|------------|----------------|
| 首页 About 摘要 `More>>` | `html/about/index.html` | `about/gongsijianjie/index.html` | 公司简介（企业详情） |
| 首页「Our Advantages」`view more` | `html/product/index.html` | `product/index.html` | 产品中心列表 |

**说明：** 仅修改 `href`，未改动按钮样式、文字（含 `More>>`、`view more` 及 `#FF6600` 颜色）。链接为相对路径，英语/阿拉伯语切换后跳转路径不变。

## 已修改链接明细

| 页面文件 | 按钮文字/位置 | 原链接 | 修改后链接 |
|----------|---------------|--------|------------|
| `index.html` | About Us 正文末尾 `More>>` | `html/about/index.html` | `about/gongsijianjie/index.html` |
| `index.html` | Our Advantages 标题旁 `view more`（`class="more"`） | `html/product/index.html` | `product/index.html` |

## 全站批量检查结果

已对项目内 **523** 个 `.html` 文件扫描以下模式：

- 文字：`More>>`、`More&gt;&gt;`、`View More`、`view more`、`View Details`
- 属性：`class="more"` 的链接

| 检查项 | 结果 |
|--------|------|
| 含错误 `html/about` / `html/product` 的 More 类链接 | **2 处（均在 index.html，已修复）** |
| More / View More 类链接总数 | **716** |
| 目标文件存在且非 404 占位页 | **716 / 716** |
| 修复后仍指向缺失文件或 404 占位页 | **0** |

产品列表页、分类页中的 `View More`（`class="more"`）均指向本站已有产品详情页（如 `2024/gzjscx_1218/284.html` 等），相对路径按目录深度正确，无需调整。

## 验证建议

1. 打开 `index.html` → 点击 About 区 `More>>` → 应进入公司简介页，非 404。
2. 点击优势区 `view more` → 应进入 `product/index.html`。
3. 切换语言为 AR 后重复上述点击，链接与页面应正常（语言由 `lang.js` 控制，与 `href` 无关）。

## 维护脚本

后续若再出现 `html/` 前缀链接，可执行：

```powershell
node scripts/fix-more-links.js
node scripts/audit-more-links.js
```
