const { execSync } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';

try {
    if (isWindows) {
        // On Windows, use Git Bash, WSL, or other shell
        execSync('sh ./scripts/emscripten.sh --build --build-webgl', { stdio: 'inherit' });
        // Alternative: execSync('bash ./emscripten.sh', { stdio: 'inherit' });
    } else {
        // On Unix-like systems
        execSync('./scripts/emscripten.sh --build --build-webgl', { stdio: 'inherit' });
    }
} catch (error) {
    console.error('Error executing script:', error);
    process.exit(1);
}