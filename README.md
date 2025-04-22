![HIBER3D](https://github.com/user-attachments/assets/d6fc8bf8-6c92-4521-913e-8a980902ebb2)

# Hiber 3D

This is a Game Template of a Hiber3D project

## Table of Content

- [Prerequisites](#prerequisites)
  - [Mac OS](#macos)
  - [Windows](#windows)
- [Getting Started](#getting-started)
- [Building for Distribution](#getting-started)
- [Compiling the Engine](#compiling-engine)
- [Working with the Engine](#)
  - [Modules](#modules)
  - [Events](#events)
  - [Assets](#assets)
  - [Editor](#editor)
    - [Scripts](#scripts)
    - [Keyboard Shortcuts](#keyboard-shortcuts)

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

## Working with the engine

### Modules

Written in C++ a module is an optional “building block” of code, with a very specific concern. This is the main way you implement your gameplay code.

To register a module to your game project, you can:

- …choose from among prebuilt Hiber modules
- …create completely new modules for custom functionality unique to your project

A module is a class and includes a registering function that can:

- register other modules
- register singletons (data)
- add systems (functionality) with schedules (on start, on tick, on frame, etc.)

### Events

Events are the main way game modules and systems communicate with each other. They’re also used for communication between the web layer and the game's WebAssembly (WASM), as well as for both internal and external module interactions. This is all handled through a double-buffered event bus.

#### Connecting events to the web layer

You can mark events to be extended to the web layer by using macros. The type need to be reflected first and then marked with one of three macros

- `HIBER3D_INTEROP_SEND_TO_JS`
- `HIBER3D_INTEROP_RECEIVE_FROM_JS`
- `HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS`

Example in C++

```C++
#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct ReadbleFromJS {
  float value;
};
struct WriteableFromJS {
  std::string value;
};
struct ReadableAndWriteableFromJS {
  bool value;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ReadbleFromJS), HIBER3D_MEMBER(value));
HIBER3D_REFLECT(HIBER3D_TYPE(WriteableFromJS), HIBER3D_MEMBER(value));
HIBER3D_REFLECT(HIBER3D_TYPE(ReadableAndWriteableFromJS), HIBER3D_MEMBER(value));

HIBER3D_INTEROP_SEND_TO_JS(ReadbleFromJS)
HIBER3D_INTEROP_RECEIVE_FROM_JS(ReadbleFromJS)
HIBER3D_INTEROP_SEND_AND_RECEIVE_FROM_JS(ReadableAndWriteableFromJS);
```

This is how you read and write the events in React.js

```tsx
const { api } = useHiber3D();

// Write GameButtonPressedEvent and pass in payload
api.writeWriteableFromJS({});
api.writeReadableAndWriteableFromJS({});

// Setup a listener for a GameStartedEvent
const listener = api.onReadbleFromJS((payload) => {
  console.log("Game event was sent with value: ", payload.value);
});

const secondListener = api.ReadableAndWriteableFromJS((payload) => {
  console.log("Another game event was sent with value: ", payload.value);
});

// Clean up
api.removeEventCallback(listener);
api.removeEventCallback(secondListener);
```

### Assets

The engine use assets and you can either register these in the C++ or you can use the editor to add assets to entities.

#### Serving Assets

Both the engine and the web defaults to read assets from the folder `assets/` in the root of the project. The folder is served by the vite development server and the editor can read images (ktx2, png), glbs, scripts (js, lua) and our internal files `.scene` and `.material`.

### Editor

The editor is written in React.js and is run locally by starting your vite development server. Open or close the Editor UI by pressing `(ctrl/cmd) + e`. You can also use query params to start the editor in play mode or hide/show the editor by default

- `showEditor`=`0|1`
- `mode`=`play|edit`

#### Scripts

You can write scripts in JavaScript that follow this pattern. Add it to an entity to have it run in Play Mode. Scripts are hot reloaded and you can see changes reflected while playing.

```js
({
  variable: 0,

  onCreate() {
    hiber3d.addEventListener(this.entity, "WriteableFromJS");
  },

  update(deltaTime) {
    this.variable += deltaTime;
  },

  onEvent(event, payload) {
    if (event === "WriteableFromJS") {
      this.variable = payload.value;
    }
  },
});
```

#### Play on Mobile

By running the development server with the host option you'll get a QR code to scan in the editor to play test on you mobile. Everything on mobile is hot reloaded and can be altered while playing. Mobile will always start in play mode.

```
npm run dev -- --host
```

#### Keyboard shortcuts

| **Action** | **id** | **Category** | **Keyboard shortcut** | **When** |
| --- | --- | --- | --- | --- |
| Change to select tool | `gizmo.select` | Gizmo | `q` | `isEditMode` |
| Change to translate tool | `gizmo.translate` | Gizmo | `w` | `isEditMode` |
| Change to rotate tool | `gizmo.rotate` | Gizmo | `e` | `isEditMode` |
| Change to scale tool | `gizmo.scale` | Gizmo | `r` | `isEditMode` |
| Save the current scene to disk | `scene.save` | Scene | `mod+s` | `isEditMode` |
| Toggle the editor UI | `editor.toggle` | Editor | `mod+e` | `always` |
| Show the selected entity in the 3d view | `entity.moveIntoView` | Entity | `f` |  |
| Duplicate the selected entity | `entity.duplicate` | Entity | `shift+d` | `isEditMode && (scenePaleFocused || canvasFocused) && entitySelected`   |
| Group the selected entities  | `entity.group` | Entity | `mod+g` | `isEditMode && (scenePaleFocused || canvasFocused) && entitySelected`   |
| Move 10x via Inspector | `entity.group` | Transform | `shift+mouse down` |  |
| Move 0,1x via Inspector | `entity.group` | Transform | `mod+mouse down` |  |
| Rotate 10x via Inspector | `entity.group` | Transform | `shift+mouse down` |  |
| Rotate 0,1x via Inspector | `entity.group` | Transform | `mod+mouse down` |  |
| Scale 10x via Inspector | `entity.group` | Transform | `shift+mouse down` |  |
| Scale 0,1x via Inspector | `entity.group`  | Transform | `mod+mouse down` |  |