const fs = require('fs');
const path = require('path');

const dir = 'src/data';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.ts') || file.endsWith('.txt')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const matches = content.match(/"[^"]+"/g);
    if (matches && matches.length > 1000) {
      console.log(file, ':', matches.length);
    }
  }
}
