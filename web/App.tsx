import { Hiber3D } from "@hiber3d/web";
import { moduleFactory } from "../build/moduleFactory";

export const App = () => (
  <Hiber3D
    moduleFactory={moduleFactory}
    config={{ Renderer: { Quality: 3, MSAASampleCount: 1 } }}
  >
    <div className="relative w-full h-dvh flex items-center justify-center">
      <h1 className="text-white">Hello Game!</h1>
    </div>
  </Hiber3D>
);
