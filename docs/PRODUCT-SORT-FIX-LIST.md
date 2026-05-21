# 产品页排序与内容修复说明

修复日期：2026-05-21（本轮全量复核）

## 问题概述

1. **左侧分类导航**：主分类 17 项、推荐产品子分类 12 项的顺序与层级需与源站 `www.zjgjmx.cn` 一致。
2. **右侧产品卡片**：部分页面卡片 HTML 被截断，导致描述/标题未正确更新；存在乱码英文、错误分类标题；「Online Inquiry」指向 `#`。
3. **产品图片**：部分图右下角带中文水印，已通过 CSS 遮罩处理（不改原图文件）。

## 修改方式

- **导航**：仅调整 `nva_box` 内 `<h3>` / `<li>` 顺序与相对路径，不改链接目标、文案、样式与展开逻辑。
- **产品卡片**：按完整 `cp_box_one` 块重排/修正描述与标题；询盘按钮改为站内 `message/index.html`。
- **双语**：英语与阿拉伯语共用同一套 HTML；`lang.js` 仅翻译显示，不改变 DOM 顺序。

## 核心脚本

| 脚本 | 作用 |
|------|------|
| `scripts/sync-product-sidebar.js` | 以 `product/10.html` 为模板，同步 89 个产品页侧栏顺序 |
| `scripts/fix-product-pages-full.js` | 修复卡片描述、大瓶水标题映射、Online Inquiry 链接 |
| `scripts/fix-detail-titles-dapinshui.js` | 同步大瓶水 10 个详情页标题 |
| `scripts/polish-garbled-en-batch.js` | 全站粘连英文片段清理 |
| `scripts/verify-product-sort-fix.js` | 一键验证（7 项检查） |

## 修改文件统计

### 侧栏导航（此前已同步，本轮复核 0 处漂移）

- **`product/` 下 89 个含 `nva_box` 的 HTML** — 主/子分类 `title` 顺序一致。

### 本轮批量修复

| 类型 | 数量 | 说明 |
|------|------|------|
| 产品列表页（`cp_box_one`） | **87+** | 描述英文化、询盘链接、大瓶水分类标题 |
| 大瓶水详情页 | **10** | `2017/dapinshui_0926/`、`2018/dapinshui_*`、`2019/dapinshui_0925/` |
| 全站 HTML 英文润色 | **524** | `polish-garbled-en-batch.js` |
| CSS | **1** | `statics/css/product-nav-fix.css`（图片角标遮罩） |

### 抽样：`product/tuijianchanpin/dapinshui/index.html`

修复后与源站产品顺序一致（10 项），标题示例：

1. Rotary Large Bottle Water Filling Machine  
2. Linear Large Bottle Water Filling Machine  
3. Large Bottle Purified Water Filling Machine  
4. Fully Automatic Large Bottle Water Filling Machine  
5. Automatic Large Bottle Filling Machine  
6. Large Bottle Rinse-Fill-Cap Monoblock  
7. Large Bottle Water Filling Machine  
8. 3–10 L Filling Machine  
9. 5 L Rinse-Fill-Cap Monoblock  
10. 5 L Rotary Filling Machine  

说明：第 3 项在源站即为「大瓶纯净水灌装机」，属于大瓶水子类，并非错挂到「纯净水」子频道。

## 标准顺序（与源站一致）

### 主分类（17）

Featured Products → Juice Filling Machine → Carbonated Beverage Filling Machine → Barrel Water Filling Machine → Water Treatment Equipment → Oil Filling Machine → Shrink Wrapping Machine → Blow Molding Machine → Injection Molding Machine → Filling Machine Spare Parts → Beer Filling Machine → Water Filling Machine → Labeling Machine → Cap Twisting Machine → Honey Filling Machine → Bottle Rinsing Machine → Vacuum Capping Machine

### 推荐产品子分类（12，仅在 Featured 下）

Filling Production Line → Detergent → Hand Sanitizer → Disinfectant → Purified Water → Mineral Water → Carbonated Beverage Filler → 5-Gallon Barrel → Glass Bottle Beverage → Large Bottle Water → Aseptic Beverage → Juice Beverage Monoblock

## 验证结果

运行：`node scripts/verify-product-sort-fix.js`

| 检查项 | 结果 |
|--------|------|
| 首页 `class_bx` 17 项分类 | 通过 |
| 首页无 `Juice Filler` title | 通过 |
| 全站产品页主/子分类标题顺序 | 通过（0 处不一致） |
| 首页浮动 WhatsApp/邮箱按钮 | 通过 |
| 首页 More 非 404 占位 | 通过 |
| 产品卡片无乱码描述 | 通过 |
| 产品卡片 Online Inquiry 非 `#` | 通过 |

**7/7 通过**

## 未改动 / 保留项

- `lang.js` 双语切换、RTL、浮动联系按钮逻辑  
- 轮播、`module-interactions.js` 导航高亮  
- 产品卡片图片文件本身（水印用 CSS 角遮罩，见 `product-nav-fix.css`）

## 本地复测建议

1. 打开 `product/tuijianchanpin/dapinshui/index.html` — 左侧 12 子类 + 17 主类顺序、当前项高亮、跳转正常。  
2. 检查 10 张卡片标题/描述为通顺英文，「View Details」进详情，「Online Inquiry」进留言页。  
3. 切换阿拉伯语 — 顺序不变，仅文案翻译。  
4. 打开首页、任意产品详情 — 确认浮动按钮与轮播仍正常。
