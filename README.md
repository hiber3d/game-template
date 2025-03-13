# Hiber3D Game Project

## Prerequisites

- node
- git-lfs
- cmake
- ccache
- ninja
- clang-format

### macOS

Install via [HomeBrew](https://brew.sh/)

`brew install cmake ccache ninja git-lfs clang-format nvm`

> Note: We recommend installing node via nvm

### Windows

Install via [Scoop](https://scoop.sh/)

`scoop install cmake ccache ninja git-lfs nvm`

> Note: We recommend installing node via nvm

clang-format is not available in `scoop`

## Getting started

From the root of the project, run

1. `npm run compile` (See below for options)
1. `npm install`
1. `npm run dev`

## Building for distribution

1. `npm run compile:release`
1. `npm install`
1. `npm run build`

## Compiling engine

If you only want to compile the C++ code you can run:

- Both:
  - `npm run compile`
  - `npm run compile:release`
- WebGPU only:
  - `npm run compile:webgpu`
  - `npm run compile:webgpu:release`
- WebGL only:
  - `npm run compile:webgl`
  - `npm run compile:webgl:release`