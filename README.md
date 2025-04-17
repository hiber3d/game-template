![HIBER3D](https://github.com/user-attachments/assets/d6fc8bf8-6c92-4521-913e-8a980902ebb2)

# Game Project

This is a Game Template of a Hiber3D project, you can use this as a start for

## Table of Content

- [Prerequisites](#prerequisites)
  - [Mac OS](#macos)
  - [Windows](#windows)
- [Getting Started](#getting-started)
- [Building for Distribution](#getting-started)
- [Compiling the Engine](#compiling-engine)

## Prerequisites

- node
- git-lfs
- cmake
- ccache
- ninja
- clang-format

### MacOS

Install via [HomeBrew](https://brew.sh/)

`brew install cmake ccache ninja git-lfs clang-format nvm`

> Note: We recommend installing node via nvm

### Windows

Install via [Scoop](https://scoop.sh/)

`scoop install cmake ccache ninja git git-lfs nvm`

> Note: We recommend installing node via nvm

(clang-format is not available in `scoop`)

## Getting started

Unless you have used `git lfs` before, it needs to be initialized now:

1. `git-lfs install`
1. `git-lfs fetch`
1. `git-lfs checkout`

Next, from the root of the project, run

1. `npm run compile` (See [below](#compiling-engine) for options)
1. `npm install`
1. `npm run dev`
1. Press `cmd + e` (`ctrl + e` on Windows) to toggle the editor

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

## C++

### Modules

A module is an optional “building block” of code, with a very specific concern. This is the main way you implement your gameplay code.

To register a module to your game project, you can:

- …choose from among prebuilt Hiber modules
- …create completely new modules for custom functionality unique to your project

A module is a class and includes a registering function that can:

- register other modules
- register singletons (data)
- add systems (functionality) with schedules (on start, on tick, on frame, etc.)

### Events

The primary route of communication between game modules and systems are Events. They can also be ussed for commmunticcation between the web layer and the game wasm, but also for inter/intra module communication, is using a double buffered event bus.

#### Connecting events to the web layer

You can mark events to be extended to the web layer by using macros. The type need to be reflected first and then marked with one of three macros

- `HIBER3D_INTEROP_SEND_TO_JS`
- `HIBER3D_INTEROP_RECEIVE_FROM_JS`
- `HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS`

Example

```C++
#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct ReadbleFromJS {
  float value;
};
struct WriteableFromJS {
  std::string value;
};
struct ReadbleAndWriteableFromJS {
  bool value;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ReadbleFromJS), HIBER3D_MEMBER(value));
HIBER3D_REFLECT(HIBER3D_TYPE(WriteableFromJS), HIBER3D_MEMBER(value));
HIBER3D_REFLECT(HIBER3D_TYPE(ReadbleAndWriteableFromJS), HIBER3D_MEMBER(value));

HIBER3D_INTEROP_SEND_TO_JS(ReadbleFromJS)
HIBER3D_INTEROP_RECEIVE_FROM_JS(ReadbleFromJS)
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(ReadbleAndWriteableFromJS);
```

## Editor

### Keyboard shortcuts

| **Action**                              | **id**                | **Category** | **Keyboard shortcut** | **When**                         |
| --------------------------------------- | --------------------- | ------------ | --------------------- | -------------------------------- | --- | --------------------------------- |
| Change to select tool                   | `gizmo.select`        | Gizmo        | `q`                   | `isEditMode`                     |
| Change to translate tool                | `gizmo.translate`     | Gizmo        | `w`                   | `isEditMode`                     |
| Change to rotate tool                   | `gizmo.rotate`        | Gizmo        | `e`                   | `isEditMode`                     |
| Change to scale tool                    | `gizmo.scale`         | Gizmo        | `r`                   | `isEditMode`                     |
| Save the current scene to disk          | `scene.save`          | Scene        | `mod+s`               | `isEditMode`                     |
| Toggle the editor UI                    | `editor.toggle`       | Editor       | `mod+e`               | `always`                         |
| Show the selected entity in the 3d view | `entity.moveIntoView` | Entity       | `f`                   |                                  |
| Duplicate the selected entity           | `entity.duplicate`    | Entity       | `shift+d`             | `isEditMode && (scenePaleFocused |     | canvasFocused) && entitySelected` |
| Group the selected entities             | `entity.group`        | Entity       | `mod+g`               | `isEditMode && (scenePaleFocused |     | canvasFocused) && entitySelected` |
| Move 10x via Inspector                  | `entity.group`        | Transform    | `shift+mouse down`    |                                  |
| Move 0,1x via Inspector                 | `entity.group`        | Transform    | `mod+mouse down`      |                                  |
| Rotate 10x via Inspector                | `entity.group`        | Transform    | `shift+mouse down`    |                                  |
| Rotate 0,1x via Inspector               | `entity.group`        | Transform    | `mod+mouse down`      |                                  |
| Scale 10x via Inspector                 | `entity.group`        | Transform    | `shift+mouse down`    |                                  |
| Scale 0,1x via Inspector                | `entity.group`        | Transform    | `mod+mouse down`      |                                  |

## Interop Layer
