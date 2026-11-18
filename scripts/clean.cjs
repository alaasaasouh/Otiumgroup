// Remove reproducible local output. Website sources, dependencies and archives stay intact.
const fs = require('node:fs');
const path = require('node:path');
const root = fs.realpathSync(path.resolve(__dirname, '..'));
for (const name of ['dist', 'preview']) {
  const target = path.resolve(root, name);
  if (path.dirname(target) !== root || path.basename(target) !== name) {
    throw new Error('Cleanup target must be the workspace dist or preview directory');
  }
  if (!fs.existsSync(target)) continue;
  if (fs.lstatSync(target).isSymbolicLink() || fs.realpathSync(target) !== target) {
    throw new Error('Refusing to clean a linked output directory: '+name);
  }
  fs.rmSync(target, {recursive:true, force:true, maxRetries:3, retryDelay:100});
  console.log('Removed generated '+name+'/');
}
