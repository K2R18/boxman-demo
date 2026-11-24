const fs = require('fs');
const path = require('path');
const { compile } = require('@tailwindcss/node');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(full);
    }
  });
  return results;
}

async function build() {
  const inputCssPath = path.join(__dirname, 'src/app/input.css');
  const outputCssPath = path.join(__dirname, 'src/app/globals.css');
  const css = fs.readFileSync(inputCssPath, 'utf8');
  console.log('Compiling CSS from', inputCssPath);
  
  const compiled = await compile(css, {
    from: inputCssPath,
    base: path.dirname(inputCssPath),
    onDependency: () => {},
  });

  const files = getFiles(path.join(__dirname, 'src'));
  const candidateSet = new Set();
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const tokens = content.match(/[a-zA-Z0-9_\-\/\[\]#:.%]+/g) || [];
    for (const t of tokens) {
      candidateSet.add(t);
    }
  }

  const candidates = Array.from(candidateSet);
  console.log(`Found ${candidates.length} candidate tokens across ${files.length} files.`);

  const result = compiled.build(candidates);
  console.log('Compiled CSS length in bytes:', result.length);
  fs.writeFileSync(outputCssPath, result);
  console.log('Successfully wrote compiled CSS directly to src/app/globals.css !');
}

build().catch(console.error);
