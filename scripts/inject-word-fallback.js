/**
 * Inject kiwl-ar-word-fallback.js before core-ar on all HTML pages that use lang.js.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const tag = '  <script src="PREFIXstatics/js/kiwl-ar-word-fallback.js"></script>\n';
let updated = 0;

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'scripts') continue;
      walk(p);
    } else if (/\.html?$/i.test(name)) {
      patch(p);
    }
  }
}

function patch(file) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes('lang.js') || text.includes('kiwl-ar-word-fallback.js')) return;
  const rel = path.relative(root, path.dirname(file)).replace(/\\/g, '/');
  const depth = rel ? rel.split('/').length : 0;
  const prefix = depth ? '../'.repeat(depth) : '';
  const insert = tag.replace('PREFIX', prefix);
  const orig = text;
  if (text.includes('kiwl-i18n-core-ar.js')) {
    text = text.replace(
      /(\s*<script src="[^"]*kiwl-i18n-core-ar\.js"><\/script>)/,
      insert + '$1'
    );
  } else if (text.includes('kiwl-i18n-en-ar.js')) {
    text = text.replace(
      /(\s*<script src="[^"]*kiwl-i18n-en-ar\.js"><\/script>)/,
      insert + '$1'
    );
  } else {
    text = text.replace(
      /(\s*<!-- kiwl-lang -->\s*\r?\n\s*<script src="[^"]*lang\.js"><\/script>)/,
      '\n  <!-- kiwl-ar-word -->\n' + insert + '$1'
    );
  }
  if (text !== orig) {
    fs.writeFileSync(file, text, 'utf8');
    updated++;
  }
}

walk(root);
console.log('Injected word fallback into', updated, 'HTML files');
