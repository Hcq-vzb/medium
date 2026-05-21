# 全站无效图片清理报告

生成时间：2026-05-21 13:24:20

## 汇总
- 修改文件数：**62**
- 删除无效 `<img>` 标签：**84**
- 修正为本地有效图片路径：**0**
- 全站验收扫描：共 **5030** 个 img，有效 **5030**，仍无效 **0**

## 处理规则
- 删除：无 src、空 src、本地文件不存在、外链无法映射到本地、src 指向非图片文件（如 .html）
- 保留并修正路径：uploadfile/ 与 statics/images/ 下真实图片文件
- 未改动：HTML 结构、文字、CSS、链接、正常产品图/logo/轮播/优势图标

## 明细（按文件）

| 文件路径 | 删除数 | 路径修正数 |
|----------|--------|------------|
| 2017/5jialundatongshui_0926/114.html | 2 | 0 |
| 2017/chuipingji_0719/53.html | 4 | 0 |
| 2017/chuipingji_0719/54.html | 4 | 0 |
| 2017/chuipingji_0719/55.html | 4 | 0 |
| 2017/chuipingji_0719/56.html | 4 | 0 |
| 2017/hanqiyinliao_0926/106.html | 0 | 0 |
| 2017/hanqiyinliao_0926/107.html | 0 | 0 |
| 2017/hanqiyinliao_0926/109.html | 0 | 0 |
| 2017/hanqiyinliao_0926/110.html | 0 | 0 |
| 2017/hanqiyinliao_0926/111.html | 0 | 0 |
| 2017/hanqiyinliao_0926/112.html | 0 | 0 |
| 2017/hqylgzj_0926/141.html | 0 | 0 |
| 2017/hqylgzj_0926/142.html | 0 | 0 |
| 2017/hqylgzj_0926/144.html | 0 | 0 |
| 2017/hqylgzj_0926/145.html | 0 | 0 |
| 2017/hqylgzj_0926/146.html | 0 | 0 |
| 2017/hqylgzj_0926/147.html | 0 | 0 |
| 2017/kehuheying_0926/20.html | 0 | 0 |
| 2017/mobaoji_0719/50.html | 0 | 0 |
| 2017/mobaoji_0719/51.html | 0 | 0 |
| 2017/mobaoji_0719/52.html | 0 | 0 |
| 2017/pijiuguanzhuangji_0719/58.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/59.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/60.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/61.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/62.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/63.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/64.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/65.html | 4 | 0 |
| 2017/shuiguanzhuangji_0719/66.html | 4 | 0 |
| 2018/5jialundatongshui_0929/155.html | 0 | 0 |
| 2018/5jialundatongshui_1008/165.html | 2 | 0 |
| 2018/5jialundatongshui_1008/166.html | 2 | 0 |
| 2018/5jialundatongshui_1024/187.html | 2 | 0 |
| 2018/5jialundatongshui_1024/188.html | 2 | 0 |
| 2018/5jialundatongshui_1024/189.html | 2 | 0 |
| 2018/5jialundatongshui_1024/190.html | 2 | 0 |
| 2018/5jialundatongshui_1217/222.html | 2 | 0 |
| 2018/5jialundatongshui_1217/223.html | 2 | 0 |
| 2018/5jialundatongshui_1217/224.html | 2 | 0 |
| 2018/5jialundatongshui_1217/225.html | 2 | 0 |
| 2018/5jialundatongshui_1217/226.html | 2 | 0 |
| 2018/5jialundatongshui_1217/227.html | 2 | 0 |
| 2018/5jialundatongshui_1217/247.html | 2 | 0 |
| 2018/5jialundatongshui_1217/248.html | 2 | 0 |
| 2018/5jialundatongshui_1217/249.html | 2 | 0 |
| 2018/hanqiyinliao_0929/156.html | 0 | 0 |
| 2018/hanqiyinliao_1008/170.html | 0 | 0 |
| 2018/hanqiyinliao_1024/183.html | 0 | 0 |
| 2018/hanqiyinliao_1024/184.html | 0 | 0 |
| 2018/hanqiyinliao_1024/185.html | 0 | 0 |
| 2018/hanqiyinliao_1024/186.html | 0 | 0 |
| 2018/hanqiyinliao_1215/217.html | 0 | 0 |
| 2018/hanqiyinliao_1215/218.html | 0 | 0 |
| 2018/hanqiyinliao_1215/219.html | 0 | 0 |
| 2018/hanqiyinliao_1215/220.html | 0 | 0 |
| 2018/hanqiyinliao_1215/221.html | 0 | 0 |
| 2018/mobaoji_0929/152.html | 0 | 0 |
| 2019/hqylgzj_0228/265.html | 0 | 0 |
| about/fazhanlicheng/index.html | 0 | 0 |
| about/index.html | 0 | 0 |
| about/yuanduifengcai/index.html | 0 | 0 |

## 说明
- 报告数据来自 `scripts/clean-broken-images.ps1` 本次运行输出
- 验收数据来自 `scripts/audit-broken-images.js` 全站扫描
- 可重复执行清理脚本；已无无效引用时不会再次修改文件