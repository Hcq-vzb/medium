/**
 * 顶栏导航英文 + Global Service Hotline（不改 DOM 结构/class）
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const pairs = [
  ['title="网站首页"', 'title="Home"'],
  ['>网站首页</a>', '>Home</a>'],
  ['title="关于我们"', 'title="About Us"'],
  ['>关于我们</a>', '>About Us</a>'],
  ['title="产品中心"', 'title="Products"'],
  ['>产品中心</a>', '>Products</a>'],
  ['title="新闻动态"', 'title="News"'],
  ['>新闻动态</a>', '>News</a>'],
  ['title="技术支持"', 'title="Support"'],
  ['>技术支持</a>', '>Support</a>'],
  ['title="客户案例"', 'title="Case Studies"'],
  ['>客户案例</a>', '>Case Studies</a>'],
  ['<h3>全球服务热线：</h3>', '<h3>Global Service Hotline:</h3>'],
  ['<h3>全球服务热线</h3>', '<h3>Global Service Hotline:</h3>'],
  ['<h3>24/7 Service Hotline:</h3>', '<h3>Global Service Hotline:</h3>'],
  ['title="Technical Support"', 'title="Support"'],
  ['>Technical Support</a>', '>Support</a>'],
];

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

let count = 0;
for (const file of walk(root)) {
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;
  for (const [from, to] of pairs) {
    raw = raw.split(from).join(to);
  }
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    count++;
  }
}
console.log('Updated header nav/hotline in', count, 'HTML files.');
