#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');

// Grab all CLI args after "node ./scripts/emscripten.cjs"
const args = process.argv.slice(2);

try {
  // On Windows...
  if (os.platform() === 'win32') {
    execSync(`sh ./scripts/emscripten.sh ${args.join(' ')}`, { stdio: 'inherit' });
  } else {
    execSync(`./scripts/emscripten.sh ${args.join(' ')}`, { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error executing script:', error);
  process.exit(1);
}
