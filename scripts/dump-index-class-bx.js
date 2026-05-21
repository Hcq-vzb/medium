const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const m = h.match(/(<div class="class_bx">[\s\S]*?<\/div>\s*<\/div>)/i);
console.log(m ? m[1] : 'not found');
