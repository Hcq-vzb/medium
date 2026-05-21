# 全站浮动联系按钮 — 部署说明

生成时间：2026-05-21

## 功能概述

全站每个页面右下角（阿拉伯语 RTL 时为左下角）固定显示两个圆形按钮：

| 按钮 | 链接 | 颜色 |
|------|------|------|
| WhatsApp | https://wa.me/8617751189576 | 品牌绿 `#25D366` |
| 邮箱 | mailto:cathy@kiwlmachine.com | 深蓝 `#0E4D90` |

- 图标：内联 SVG，无外部 CDN
- 层级：`z-index: 9999`
- 悬停：轻微放大 + 阴影加深 + 颜色加深

## 布局规则

| 端 | 英语 (LTR) | 阿拉伯语 (`html[dir="rtl"]`) |
|----|------------|------------------------------|
| PC | 右侧距边 18px，距底约 100px，上下排列 | 自动切换到**左侧** |
| 手机 (≤768px) | 底部居中横排，按钮 46px | 同样底部居中（RTL 不左右错位） |

双语切换由现有 `lang.js` 设置 `dir="rtl"`，按钮 CSS 自动适配，无需额外 JS。

## 修改的文件

### 新增（模板，勿删）

- `statics/snippets/kiwl-float-contact.html` — 通用 HTML + `<style>` 片段（维护时改此文件后重新执行注入脚本）

### 批量修改

- **523 个** `.html` 页面：在 `</body>` 前追加了 `<!-- kiwl-float-contact -->` 及完整按钮代码  
- **未改动** 原有 header、导航、正文、CSS、JS 逻辑，仅为追加

### 注入脚本（可重复执行）

- `scripts/inject-float-contact.js` — 已含片段的页面会自动跳过

```powershell
cd "站点根目录"
node scripts/inject-float-contact.js
```

## 使用说明

1. **WhatsApp**：点击绿色按钮 → 浏览器打开 WhatsApp（网页版或 App），号码 +86 177 5118 9576。
2. **邮箱**：点击蓝色按钮 → 系统默认邮件客户端新建邮件，收件人 `cathy@kiwlmachine.com`。
3. **更换号码或邮箱**：编辑 `statics/snippets/kiwl-float-contact.html` 中对应 `href`，再运行 `node scripts/inject-float-contact.js`（或全局替换已注入页面中的链接）。

## 验证清单

请在本地打开以下页面自测：

- [ ] `index.html` — 按钮可见，不挡主导航
- [ ] `product/index.html` — 产品列表页正常
- [ ] `about/gongsijianjie/index.html` — 企业简介页正常
- [ ] `contactus/index.html` — 联系页正常
- [ ] 切换 **AR** 后刷新 — 按钮移到页面**左侧**
- [ ] 浏览器宽度 &lt; 768px — 按钮在底部居中、尺寸变小
- [ ] 点击 WhatsApp / 邮箱 — 能正常唤起对应应用

## 技术说明

- 容器使用 `pointer-events: none`，仅按钮可点击，减少遮挡正文误触。
- `target="_blank"` + `rel="noopener noreferrer"` 用于 WhatsApp 外链。
- 与 `kiwl-lang-switcher`、移动端导航按钮位置错开（浮动按钮 `bottom: 100px`，移动端 `bottom: 16px`）。
