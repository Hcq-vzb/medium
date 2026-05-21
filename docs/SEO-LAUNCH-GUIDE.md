# Medium Beverage Machinery — SEO & 上线指南

站点域名：**https://mediumbeveragemachinery.com**

## 一、关键词体系（已写入 `scripts/seo-config.js`）

### 英语核心词
- medium beverage machinery
- beverage filling machine
- water bottling machine

### 阿拉伯语核心词
- آلات تعبئة المشروبات متوسطة الحجم
- آلة تعبئة المشروبات
- آلة تعبئة المياه المعبأة

### 长尾词（按产品分类映射）
| 分类 slug | 英语长尾示例 |
|-----------|----------------|
| guozhiyinliao / guozhiguanzhuangji | juice filling machine |
| hanqiyinliao / hqylgzj | carbonated drink filling line |
| 5jialundatongshui | 5-gallon barrel water filling machine |
| gzjscx 等 | beverage packaging machinery |
| shuichulishebei | water treatment equipment for beverage production |

## 二、全站元标签

- **Title 格式**：`{关键词/产品名} | mediumbeveragemachinery.com`（约 50–60 字符）
- **Description**：120–160 字符，含 1–2 个核心词
- **Keywords**：每页 3–5 个相关词
- **阿拉伯语**：`<html data-seo-ar-title/desc/keywords>` + `statics/js/seo-meta-ar.js`（切换 AR 时更新 title/description）

## 三、根目录 SEO 文件

| 文件 | 说明 |
|------|------|
| `/sitemap.xml` | 513+ URL，含 `hreflang` en/ar/x-default |
| `/robots.txt` | Allow 全站，Disallow scripts/docs/备份，指向 sitemap |

上线后在 Google Search Console / Bing 提交：`https://mediumbeveragemachinery.com/sitemap.xml`

## 四、维护脚本

```bash
node scripts/apply-seo-launch.js      # 批量 meta + 域名 + canonical
node scripts/seo-fix-v2.js            # 去重 meta、hreflang、产品唯一 title
node scripts/generate-sitemap-robots.js # 重新生成 sitemap/robots
node scripts/fix-article-static-paths.js # 修正文章页 statics 相对路径
node scripts/prelaunch-audit.js       # 生成 docs/PRELAUNCH-AUDIT.md
```

## 五、上线前自检（当前状态）

| 项目 | 状态 |
|------|------|
| 旧域名 zjgjmx.cn | ✅ 0 残留 |
| 站内链接 kiwlmachine.com（非邮箱） | ✅ 已替换为 mediumbeveragemachinery.com |
| sitemap.xml / robots.txt | ✅ 已生成 |
| 双语 AR meta | ✅ data 属性 + seo-meta-ar.js |
| 联系邮箱 | 仍为 cathy@kiwlmachine.com（可按需改） |

### 建议您上线后人工抽查
1. 手机端 + 阿拉伯语 RTL 各抽 3 页（首页、产品分类、询盘表单）
2. 询盘表单提交、WhatsApp/邮件浮动按钮
3. 轮播图与产品侧栏排序
4. Google Rich Results / 移动端友好性测试

## 六、Search Console 配置

1. 验证域名所有权  
2. 提交 sitemap  
3. 设置国际定位：同一 URL + `hreflang` en/ar（本站为前端切换语言）
