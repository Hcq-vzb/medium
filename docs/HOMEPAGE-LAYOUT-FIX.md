# Homepage layout fix checklist

**Date:** 2026-05-22 (updated)  
**Scope:** `index.html` + `statics/css/home-layout-fix.css` (homepage only)

## 一、产品区（Product Showcase）

| 问题 | 修复位置 | 效果 |
|------|----------|------|
| 桌面端无法稳定三列、易变成 2/4 列 | `home-layout-fix.css` → `.cp_bx ul` **CSS Grid** `repeat(3, 1fr)` | 桌面固定 3×3（9 张卡片），取消 `min-width: 260px` 折行 |
| 平板/手机断点 | `@media 768–1024` 两列；`max-width: 767` 单列 | 与 `responsive.css` 浮动规则用 `!important` 覆盖，避免错位 |
| 产品仅 6 个 | `index.html` 新增 3 张卡片 | 纯净水 / 矿泉水 / 碳酸饮料灌装机，共 **9** 个产品 |
| 产品标题/描述挤在一起 | `#index .products .cp_bx ul li` flex 列 | 标题、描述 `line-height` 统一，描述 `-webkit-line-clamp: 4` |
| 侧栏与产品区挤压 | `#index .products .cp_cont` flex + 侧栏 220px | 与 `.w1200` 居中对齐，右侧网格自适应 |
| 图片中文水印 | `.pic::before` 右下角 + `.pic::after` 底边渐变 | 弱化 KIWL/鑫紫鲸 角标（烧录文字需换图才能彻底去除） |
| View More 空框/无文字 | `lang.js` 跳过 `data-lang-key` 文本快照；`a.more` 去除 `more_bg.jpg` 背景图 | EN「View More」/ AR「عرض المزيد」白字蓝底可点击 |
| RTL 阿拉伯语 | `html[dir="rtl"] .cp_bx ul { direction: rtl }` | 网格从右向左排布，文案右对齐 |

## 二、优势区（Our Advantages）

| 问题 | 修复位置 | 效果 |
|------|----------|------|
| h2 + h3 重复 “Advantages” 视觉叠加 | 删除 `h3`，CSS `h3 { display: none }` | 仅保留 **Our Advantages** / AR **مزايانا** |
| 标题色 `#101010` 在绿色背景难读 | `tit_bt h2 { color: #fff }` | 标题清晰可读 |
| VIEW MORE 与标题重叠 | `tit_bt` flex 列 + `a.more { margin-top: auto }` | 按钮固定在左栏底部，hover 品牌蓝 |
| 右侧四块错位 | `youshi .cont` flex，四列 `flex: 1 1 25%` | 图标与标题对齐，平板/手机自动折行 |

**双语：** `data-lang-key="our_advantages"`、`view_more`；`lang.js` 增加 `our_advantages`、`industry_updates`。

## 三、新闻 / 案例区

| 问题 | 修复位置 | 效果 |
|------|----------|------|
| Company News / Industry Updates 错位 | 去掉 `float:right` 内联样式；`.news .cont` flex 50%/50% | 左右栏对齐、等宽 |
| 标题与日期重叠 | `ul li` flex 布局，`.news-date` 靠右 | 日期与标题分行对齐 |
| 热点新闻标题截断 | `.hot` flex，`.text h2` `height: auto` | 长标题自动换行 |
| 案例乱码 `customer We!..` 等 | `index.html` `.anli` 四条 `<p>` | 改为简短英文介绍 |

## 四、Global Network / 响应式

| 问题 | 修复位置 | 效果 |
|------|----------|------|
| 全球网点卡片错位 | `.wangdian ul` flex 四列 | 间距均匀，手机单列 |
| 手机端叠加 | `@media max-width: 768px` | 产品/优势/新闻/案例单列 |
| 阿拉伯语 RTL | `html[dir="rtl"]` 块于 `home-layout-fix.css` | 产品区、新闻日期、优势区方向正确 |

## 五、未改动（保持原有功能）

- `lang.js` / `kiwl-i18n-*.js` 双语逻辑（仅新增 2 个 key）
- `seo-meta-ar.js`、canonical、meta 标签
- `product-nav-fix.css` 侧栏排序与样式
- 询盘表单、浮动 WhatsApp/邮件按钮
- 轮播 `home-banner-init.js`

## 验证建议

1. 桌面 1920 / 1366：产品三列、新闻左右栏、优势一行四块。  
2. 手机 375px：产品单列，侧栏隐藏（沿用 `responsive.css`）。  
3. 切换 AR：优势标题 **مزايانا**，新闻日期在左侧（RTL）。  
4. 点击产品侧栏链接、View More、询盘页 — 功能正常。
