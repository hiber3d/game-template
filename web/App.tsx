import { Hiber3D } from "@hiber3d/web";
import { moduleFactory } from "../build/moduleFactory";

export const App = () => (
  <Hiber3D
    moduleFactory={moduleFactory}
    config={{ Renderer: { Quality: 3, MSAASampleCount: 1 } }}
  >
    <div className="absolute w-full h-full flex items-start justify-center p-2">
      <h1 className="text-white pt-4">Web UI in Play Mode</h1>
    </div>
  </Hiber3D>
);
