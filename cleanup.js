const fs = require('fs');
const path = require('path');

const root = __dirname;
const docsDir = path.join(root, 'docs');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

const filesToMove = ['ADMIN_CREDENTIALS.md', 'ARCHITECTURE.md', 'SETUP.md'];
for (const file of filesToMove) {
  const src = path.join(root, file);
  const dest = path.join(docsDir, file);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved ${file} to docs/`);
  }
}

const filesToDelete = [
  path.join(root, 'backend', 'test', 'app.e2e-spec.ts'),
  path.join(root, 'backend', 'test', 'jest-e2e.json'),
  path.join(root, 'test-graphql.js') // also cleaning up the temporary script
];

for (const file of filesToDelete) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted ${path.basename(file)}`);
  }
}

console.log('Cleanup completed successfully!');
