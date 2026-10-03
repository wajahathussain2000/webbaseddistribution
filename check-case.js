const fs = require('fs'); 
const path = require('path'); 

function checkDir(dir) { 
  const files = fs.readdirSync(dir); 
  files.forEach(file => { 
    const fullPath = path.join(dir, file); 
    if (fs.statSync(fullPath).isDirectory()) checkDir(fullPath); 
    else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) { 
      const content = fs.readFileSync(fullPath, 'utf8'); 
      const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g; 
      let match; 
      while ((match = regex.exec(content)) !== null) { 
        const importPath = match[1]; 
        if (importPath.startsWith('@/')) { 
          const absPath = path.join(__dirname, importPath.replace('@/', './')); 
          const exts = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
          let found = false;
          let matchedExt = '';
          for(const ext of exts) {
             if (fs.existsSync(absPath + ext)) {
                found = true;
                matchedExt = ext;
                break;
             }
          }
          if (found) {
             // Check case sensitivity by looking at readdir
             const dirName = path.dirname(absPath + matchedExt);
             const baseName = path.basename(absPath + matchedExt);
             if (fs.existsSync(dirName)) {
                const actualFiles = fs.readdirSync(dirName);
                if (!actualFiles.includes(baseName)) {
                   console.log('Case mismatch in ' + fullPath + ' -> ' + importPath + ' (Expected: ' + baseName + ')');
                }
             }
          }
        } 
      } 
    } 
  }); 
} 
checkDir('./app');
