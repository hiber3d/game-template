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

1. `npm install`
1. `npm run dev`

## Compiling engine

If you only want to compile the C++ code you can run

`npm run compile`
