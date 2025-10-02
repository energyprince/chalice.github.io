/*
  Strips missing source map reference from @mediapipe/tasks-vision to silence
  source-map-loader warnings in CRA dev builds.
*/
const fs = require('fs');
const path = require('path');

const targets = [
  path.join(process.cwd(), 'node_modules', '@mediapipe', 'tasks-vision', 'vision_bundle.mjs'),
  path.join(process.cwd(), 'node_modules', '@mediapipe', 'tasks-vision', 'vision_bundle.js'),
];

const removeSourceMapURL = (file) => {
  if (!fs.existsSync(file)) return false;
  try {
    const src = fs.readFileSync(file, 'utf8');
    const replaced = src
      .replace(/\n\s*\/\/[#@]\s*sourceMappingURL=.*\n?/g, '\n')
      .replace(/\/*#\s*sourceMappingURL=.*?\*\//gs, '');
    if (replaced !== src) {
      fs.writeFileSync(file, replaced, 'utf8');
      console.log(`Patched sourceMappingURL in: ${path.relative(process.cwd(), file)}`);
      return true;
    }
  } catch (e) {
    console.warn(`Could not patch ${file}:`, e.message);
  }
  return false;
};

let changed = false;
for (const t of targets) {
  changed = removeSourceMapURL(t) || changed;
}

if (!changed) {
  console.log('No Mediapipe files patched (already clean or not installed).');
}

