import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const rootDir = process.cwd();

// Check for existing .h3dproject files
fs.readdirSync(rootDir).forEach((file) => {
  if (file.endsWith('.h3dproject')) {
    process.exit(0);
  }
});

// Helper function to prettify the project name
function prettifyName(name) {
  return name
    .replace(/[-_]/g, ' ') // Replace - and _ with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}

// Get the project name from the environment variable or default to the prettified root directory name
const projectName = process.env.PROJECT_NAME || prettifyName(path.basename(rootDir));

// Create a new .h3dproject file
const newProjectFilePath = path.join(rootDir, `${projectName}.h3dproject`);
const projectData = {
  name: projectName,
  schema: '1',
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
};

fs.writeFileSync(newProjectFilePath, JSON.stringify(projectData, null, 2));

console.log(`Created new project file: "${path.basename(newProjectFilePath)}".`);