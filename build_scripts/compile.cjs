#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, "..");

const currentOS = detectOS();

const EMSCRIPTEN_VERSION = "3.1.64";

function printUsage() {
  console.log(`Usage: node ${path.basename(__filename)} [--clean] [--webgl] [--webgpu] [--install-emsdk] [--reinstall-emsdk] [--debug] [--release] [--help]
  --clean           Clear CMake cache, build directory, and ccache (always runs first if specified)
  --webgpu          Build for WebGPU
  --webgl           Build for WebGL
  --install-emsdk   Install Emscripten SDK if not present
  --reinstall-emsdk Clean and reinstall Emscripten
  --debug           Build in Debug mode with -Wl,--lto-O0
  --release         Build in Release mode
  -h, --help        Show this help message

You can use multiple flags together. Build installs Emscripten if not present.
Note: This script needs to set environment variables for Emscripten in the current session.`);
}

function installEmscripten() {
  console.log("Installing Emscripten and dependencies...");
  try {
    execSync(`git clone https://github.com/emscripten-core/emsdk.git`, { stdio: 'inherit', windowsHide: true });
    process.chdir(path.join(process.cwd(), "emsdk"));

    if (currentOS === 'windows') {
      execSync(`emsdk.bat install ${EMSCRIPTEN_VERSION}`, { stdio: 'inherit', windowsHide: true });
      execSync(`emsdk.bat activate ${EMSCRIPTEN_VERSION}`, { stdio: 'inherit', windowsHide: true });
    } else { 
      execSync(`./emsdk install ${EMSCRIPTEN_VERSION}`, { stdio: 'inherit' });
      execSync(`./emsdk activate ${EMSCRIPTEN_VERSION}`, { stdio: 'inherit' });
    }
      
      // Move into upstream/emscripten to run npm install
      process.chdir(path.join(process.cwd(), "upstream", "emscripten"));
      console.log("Running npm install...");
      execSync(`npm install`, { stdio: 'inherit' });

    console.log("Installation complete.");
    // Return to repo root
    process.chdir(path.resolve(__dirname));
  } catch (err) {
    console.error("Error during Emscripten installation:", err);
    process.exit(1);
  }
}

function setEnvironmentVariables() {
  const emsdkRoot = path.join(projectRoot, "emsdk");
  const emscriptenBin = path.join(emsdkRoot, "upstream", "emscripten");

  process.env.EMSDK = emsdkRoot;
  process.env.PATH = `${emscriptenBin}${path.delimiter}${process.env.PATH}`;
  process.env.EMSDK_QUIET = "1"; // Silence logging from emsdk_env.sh

  console.log("Emscripten environment variables set for the current session.");
}

function ensureEmscripten() {
  const emsdkPath = path.join(projectRoot, "emsdk");
  if (!fs.existsSync(emsdkPath)) {
    console.log("Emscripten SDK not found. Installing now...");
    installEmscripten();
  }
  setEnvironmentVariables();
}

function cleanInstall() {
  console.log("Clearing existing installation...");
  const emsdkPath = path.join(projectRoot, "emsdk");
  if (fs.existsSync(emsdkPath)) {
    fs.rmSync(emsdkPath, { recursive: true, force: true });
  }
  installEmscripten();
  setEnvironmentVariables();
}

function detectOS() {
  const platform = os.platform();
  if (platform === "win32") {
    return "windows";
  } else if (platform === "linux" || platform === "darwin") {
    return "unix";
  } else {
    return "unknown";
  }
}

function build(platformName, graphicsBackend, buildType) {
  console.log(`Building the project for '${platformName}' using '${graphicsBackend}' in ${buildType} mode...`);

  let CMAKE_OPTIONAL_ARGS = "";
  let LINKER_FLAGS = "";

  // Setup ccache
  if (platformName === "windows") {
    process.env.EM_COMPILER_WRAPPER = "ccache";
  } else if (platformName === "unix") {
    CMAKE_OPTIONAL_ARGS = "-DCMAKE_C_COMPILER_LAUNCHER=ccache -DCMAKE_CXX_COMPILER_LAUNCHER=ccache";
  } else {
    console.error(`Unknown platform argument '${platformName}'`);
    process.exit(1);
  }

  // Set webgl/webgpu and target
  let BUILD_PATH;
  let USE_WEBGPU;
  if (graphicsBackend === "webgpu") {
    BUILD_PATH = path.join(projectRoot, "build", "webgpu");
    USE_WEBGPU = "true";
  } else if (graphicsBackend === "webgl") {
    BUILD_PATH = path.join(projectRoot, "build", "webgl");
    USE_WEBGPU = "false";
  } else {
    console.error(`Unknown graphics backend argument '${graphicsBackend}'`);
    process.exit(1);
  }

  // Set build-type specific flags
  if (buildType === "Debug") {
    LINKER_FLAGS = "-Wl,--lto-O0";
  }

  // Create the build directory if needed
  if (!fs.existsSync(BUILD_PATH)) {
    fs.mkdirSync(BUILD_PATH, { recursive: true });
  }

  // Clear and touch ccache_stats.txt
  const ccacheStatsPath = path.join(BUILD_PATH, "ccache_stats.txt");
  try {
    if (fs.existsSync(ccacheStatsPath)) {
      fs.rmSync(ccacheStatsPath);
    }
    fs.writeFileSync(ccacheStatsPath, "");
  } catch (err) {
    console.warn("Warning: Could not reset ccache_stats.txt:", err);
  }
  process.env.CCACHE_STATSLOG = path.join(BUILD_PATH, "ccache_stats.txt");

  // Activate emsdk and run cmake configure + build
  try {
    // Activate specific EMSCRIPTEN version
    execSync(`"${process.env.EMSDK}/emsdk.bat" activate ${EMSCRIPTEN_VERSION}`, { stdio: 'inherit', windowsHide: true });

    // Run CMake configure
    const cmakeCmd = [
      "cmake",
      `-DCMAKE_TOOLCHAIN_FILE="${process.env.EMSDK}/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake"`,
      `-G "Ninja"`,
      `-DHBR_USE_WEBGPU="${USE_WEBGPU}"`,
      `-DCMAKE_BUILD_TYPE="${buildType}"`,
      CMAKE_OPTIONAL_ARGS,
      `-S "${projectRoot}"`,
      `-B "${BUILD_PATH}"`,
    ].filter(Boolean).join(" ");

    execSync(cmakeCmd, { stdio: 'inherit', windowsHide: true });

    // Build with Ninja, passing linker flags
    const buildCmd = `cmake --build ${BUILD_PATH}`;
    execSync(buildCmd, { stdio: 'inherit', windowsHide: true, env: {
      ...process.env,
      LDFLAGS: LINKER_FLAGS
    }});

  } catch (err) {
    console.error("Error during build:", err);
    process.exit(1);
  }

  // Print ccache run stats
  console.log("ccache statistics for this build:");
  try {
    execSync("ccache --show-log-stats -v", { stdio: 'inherit', windowsHide: true });
  } catch (err) {
    console.warn("Warning: ccache not found or failed to show stats:", err);
  }

}

// -----------------------
// Function: Clean CMake cache, build directory, and ccache
// -----------------------
function cleanBuild() {
  console.log("Cleaning build artifacts and ccache...");
  const buildDir = path.join(projectRoot, "build");
  if (fs.existsSync(buildDir)) {
    console.log("Removing build directory...");
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  console.log("Clearing ccache...");
  try {
    execSync("ccache -C", { stdio: 'inherit' });
  } catch (err) {
    console.warn("Warning: ccache not found or failed to clear:", err);
  }
  console.log("Clean complete.");
}

function main(args) {
  let buildType = "Debug";
  
  if (args.length === 0) {
    ensureEmscripten();
    build(detectOS(), "webgpu", buildType);
    build(detectOS(), "webgl", buildType);
    process.exit(0);
  }

  if (args.includes("--clean")) {
    cleanBuild();
  }

  if (args.includes("--debug")) {
    buildType = "Debug";
  } else if (args.includes("--release")) {
    buildType = "Release";
  }

  // Process other flags in order
  let idx = 0;
  while (idx < args.length) {
    const arg = args[idx];
    switch (arg) {
      case "--clean":
        // Already handled above; nothing more to do here
        break;

      case "--install-emsdk":
        ensureEmscripten();
        break;

      case "--reinstall-emsdk":
        cleanInstall();
        break;

      case "--webgpu":
        ensureEmscripten();
        build(detectOS(), "webgpu", buildType);
        break;

      case "--webgl":
        ensureEmscripten();
        build(detectOS(), "webgl", buildType);
        break;

      case "--debug":
      case "--release":
        // Handled above under buildType; skip here
        break;

      case "-h":
      case "--help":
        printUsage();
        process.exit(0);
        break;

      default:
        console.error(`Unknown argument: ${arg}`);
        printUsage();
        process.exit(1);
    }
    idx++;
  }

  // Handle GitHub Actions environment exports if needed
  if (process.env.GITHUB_ENV && fs.existsSync(path.join(projectRoot, "emsdk"))) {
    try {
      // Append EMSDK path to GITHUB_ENV
      fs.appendFileSync(process.env.GITHUB_ENV, `EMSDK=${path.join(projectRoot, "emsdk")}\n`);
      // Append Emscripten bin to GITHUB_PATH
      fs.appendFileSync(process.env.GITHUB_PATH, `${path.join(projectRoot, "emsdk", "upstream", "emscripten")}\n`);
    } catch (err) {
      console.warn("Warning: Could not write to GITHUB_ENV or GITHUB_PATH:", err);
    }
  }
}

main(process.argv.slice(2));
