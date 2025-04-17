import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { useEffect } from "react";

const ExampleEvent = () => {
  const { api } = useHiber3D();

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onExampleEvent((payload) => {
      console.debug(payload);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  return null;
};

export const App = () => (
  <Hiber3D build={{ webGPU, webGL }}>
    <ExampleEvent />
  </Hiber3D>
);
