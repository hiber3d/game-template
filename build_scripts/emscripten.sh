#!/bin/bash

export EMSCRIPTEN_VERSION="3.1.64"

# Function to print usage information
print_usage() {
    echo "Usage: source $0 [--clean] [--install] [--build] [--build-webgl] [--build-webgpu] [--clean-install] [--debug] [--release]"
    echo "  --clean         Clear CMake cache, build directory, and ccache (always runs first if specified)"
    echo "  --install       Install Emscripten and dependencies"
    echo "  --build         Build for WebGPU only (default)"
    echo "  --build-webgpu  Build for WebGPU"
    echo "  --build-webgl   Build for WebGL"
    echo "  --clean-install Clean and reinstall Emscripten"
    echo "  --debug         Build in Debug mode with -Wl,--lto-O0"
    echo "  --release       Build in Release mode"
    echo "You can use multiple flags together. Build installs Emscripten if not present."
    echo "Note: This script should be run with 'source' to set environment variables."
}

# Function to install Emscripten and dependencies
install_emscripten() {
    echo "Installing Emscripten and dependencies..."
    git clone https://github.com/emscripten-core/emsdk.git
    cd ./emsdk
    ./emsdk install $EMSCRIPTEN_VERSION
    ./emsdk activate $EMSCRIPTEN_VERSION
    cd upstream/emscripten
    echo "Running npm install..."
    npm install
    echo "Installation complete."
    cd ../../..
}

# Function to set environment variables
set_environment_variables() {
    export EMSDK=$(pwd)/emsdk
    export PATH="$EMSDK/upstream/emscripten:$PATH"
    export EMSDK_QUIET=1 # Silence logging when starting emsdk environment below
    source "$EMSDK/emsdk_env.sh"
    echo "Emscripten environment variables set for the current session."
}

# Function to ensure Emscripten is installed and environment is set
ensure_emscripten() {
    if [ ! -d "emsdk" ]; then
        echo "Emscripten SDK not found. Installing now..."
        install_emscripten
    fi
    set_environment_variables
}

clean_install() {
    echo "Clearing existing installation..."
    rm -rf emsdk
    install_emscripten
    set_environment_variables
}

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     echo "unix";;
        Darwin*)    echo "unix";;
        CYGWIN*)    echo "windows";;
        MINGW*)     echo "windows";;
        MSYS*)      echo "windows";;
        *)          echo "unknown";;
    esac
}

# $1: Platform "windows"/"unix"
# $2: Graphics backend "webgl"/"webgpu"
# $3: Build type "Debug"/"Release"
build() {
    echo "Building the project for '$1' using '$2' in $3 mode..."

    mkdir -p build

    CMAKE_OPTIONAL_ARGS=""
    LINKER_FLAGS=""

    # Setup ccache
    if [ "$1" == "windows" ]; then
        export EM_COMPILER_WRAPPER=ccache
    elif [ "$1" == "unix" ]; then
        CMAKE_OPTIONAL_ARGS="-DCMAKE_C_COMPILER_LAUNCHER=ccache -DCMAKE_CXX_COMPILER_LAUNCHER=ccache"
    else
        echo "Unknown argument '$1'"
        return 1
    fi

    # Set webgl/webgpu and target
    if [ "$2" == "webgpu" ]; then
        TARGET="GameTemplate"
    elif [ "$2" == "webgl" ]; then
        TARGET="GameTemplate_webgl"
    else
        echo "Unknown argument '$2'"
        return 1
    fi

    # Set build type specific flags
    if [ "$3" == "Debug" ]; then
        LINKER_FLAGS="-Wl,--lto-O0"
    fi

    # Run cmake configure and build
    pushd build

    # Save ccache run into stats file
    rm -f ccache_stats.txt
    touch ccache_stats.txt
    export CCACHE_STATSLOG=ccache_stats.txt

    emsdk activate $EMSCRIPTEN_VERSION && \
    cmake -DCMAKE_TOOLCHAIN_FILE="$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake" \
          -G "Ninja" \
          -DCMAKE_BUILD_TYPE="$3" \
          $CMAKE_OPTIONAL_ARGS \
          .. && \
    LDFLAGS="$LINKER_FLAGS" cmake --build . --target $TARGET

    build_result=$?

    # Print ccache run stats
    echo 'ccache statistics for this build:'
    ccache --show-log-stats -v

    popd
}

# Function to clean CMake cache, build directory, and ccache
clean_build() {
    echo "Cleaning build artifacts and ccache..."
    if [ -d "build" ]; then
        echo "Removing build directory..."
        rm -rf build
    fi
    echo "Clearing ccache..."
    ccache -C
    echo "Clean complete."
}

# Main script logic
if [ $# -eq 0 ]; then
    print_usage
    exit
fi

# Default build type
BUILD_TYPE="Debug"

# Check for --clean flag first
for arg in "$@"; do
    if [ "$arg" == "--clean" ]; then
        clean_build
        break
    fi
done

# Check for build type flags
for arg in "$@"; do
    if [ "$arg" == "--debug" ]; then
        BUILD_TYPE="Debug"
        break
    elif [ "$arg" == "--release" ]; then
        BUILD_TYPE="Release"
        break
    fi
done

# Process other flags
while [ "$1" != "" ]; do
    case $1 in
        --clean )           # Already handled, skip
                            ;;
        --install )         ensure_emscripten
                            ;;
        --clean-install )   clean_install
                            ;;
        --build-webgpu )    ensure_emscripten
                            build $(detect_os) "webgpu" "$BUILD_TYPE"
                            ;;
        --build-webgl )     ensure_emscripten
                            build $(detect_os) "webgl" "$BUILD_TYPE"
                            ;;
        --build )           ensure_emscripten
                            build $(detect_os) "webgpu" "$BUILD_TYPE"
                            ;;
        --debug )           # Already handled, skip
                            ;;
        --release )         # Already handled, skip
                            ;;
        -h | --help )       print_usage
                            return 0
                            ;;
        * )                 print_usage
                            return 1
    esac
    shift
done

# Handle GitHub Actions environment if needed
if [ -n "$GITHUB_ENV" ] && [ -d "emsdk" ]; then
    echo "EMSDK=$(pwd)/emsdk" >> $GITHUB_ENV
    echo "$(pwd)/emsdk/upstream/emscripten" >> $GITHUB_PATH
fi
