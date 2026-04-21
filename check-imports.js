const fs = require('fs');
const path = require('path');

function check(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      check(fullPath);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import.*?from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const absDir = path.dirname(path.resolve(fullPath, importPath));
          const basename = path.basename(importPath);
          if (fs.existsSync(absDir)) {
            const actualFiles = fs.readdirSync(absDir);
            const exactlyMatches = actualFiles.some(f => f === basename || f.startsWith(basename + '.'));
            if (!exactlyMatches) {
              const lowerMatch = actualFiles.find(f => f.toLowerCase().startsWith(basename.toLowerCase() + '.'));
              if (lowerMatch) {
                console.log(`Mismatch in ${fullPath}: imported '${importPath}', actual file is '${lowerMatch}'`);
              }
            }
          }
        }
      }
    }
  }
}
check('src');
