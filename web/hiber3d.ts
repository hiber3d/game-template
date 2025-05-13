import { createHiber3DApp } from "@hiber3d/web";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { moduleFactory as webGL } from "GameTemplate_webgl";
export type * from "GameTemplate_webgpu/GameTemplate_webgpu";

export const { Hiber3D, useHiber3D } = createHiber3DApp({ webGPU, webGL });
