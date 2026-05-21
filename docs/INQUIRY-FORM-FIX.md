# Online Inquiry 表单修复说明

## 涉及页面

全站仅 **`message/index.html`**（Online Inquiry）包含联系表单；产品页等通过链接跳转至该页。

## 一、功能修复

| 问题 | 处理 |
|------|------|
| 提交/重置按钮无文字 | 提交：`Send Inquiry` / `إرسال الاستفسار`；重置：`Reset` / `إعادة تعيين`（`data-lang-key` + `lang.js` 双语切换） |
| 提交跳转到原站 `zjgjmx.cn` | 已删除 `action="https://www.zjgjmx.cn/..."` |
| 静态邮箱提交 | `action="mailto:cathy@kiwlmachine.com"`、`method="POST"`、`enctype="text/plain"`；JS 确认后通过 `mailto:?subject=&body=` 打开本地邮件客户端 |
| 乱码引导语 `We We , We！` | 替换为英文引导语，阿拉伯语由 `lang.js` 翻译 |

## 二、UI/UX 改造

- 新样式表：`statics/css/inquiry-form.css`（品牌蓝边框、4px 圆角、聚焦高亮）
- 提交按钮：品牌蓝 `#0e4d90`，hover 加深并轻微放大
- 重置按钮：浅灰背景，与提交区分
- 客服头像：160px，桌面端右上；手机端移至引导文字下方，不遮挡输入框
- 标签：`Message Board` → `Message` / `رسالة`
- 手机端：表单与按钮 100% 宽度；RTL 右对齐（`lang.css` + `inquiry-form.css`）

## 三、新增/修改文件

- `statics/css/inquiry-form.css` — 表单样式
- `statics/js/kiwl-inquiry-form.js` — 提交确认、mailto 组装、按钮文案
- `statics/js/lang.js` — 表单相关 `I18N` 键、`applyLangKeys` 支持 `input` 的 `value`
- `message/index.html` — 表单 HTML 与资源引用

## 四、使用注意事项

1. **需本地邮件客户端**：提交依赖用户设备已配置 Outlook、Mail、Thunderbird 等；无客户端时可能无反应或仅提示无法处理 `mailto`。
2. **确认对话框**：点击「Send Inquiry」会先弹出中/英确认说明，取消则不会打开邮件。
3. **邮件正文**：自动包含 Subject、Name、Tel、Message 四行；用户可在发信前在客户端内再编辑。
4. **静态站点**：无服务器端收信；若需网页内直接提交到后台，需另行接入 Formspree、EmailJS 等服务。
5. **测试**：请 Ctrl+F5 强刷后，在英文/阿拉伯语下各测一次提交与重置；手机宽度 ≤768px 检查 RTL 与按钮宽度。

## 五、验证清单

- [ ] 按钮文字可见（蓝/灰底、白/深灰字）
- [ ] 提交不跳转 zjgjmx.cn
- [ ] 确认后打开邮件且正文含表单内容
- [ ] 重置清空字段
- [ ] 切换 العربية 后标签与按钮为阿拉伯语、表单右对齐
- [ ] 手机端无横向溢出
