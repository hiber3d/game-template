import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { default as moduleFactoryWebGPU } from "GameTemplate_webgpu";
import { default as moduleFactoryWebGL } from "GameTemplate_webgl";
import { useEffect } from "react";

const ExampleEvent = () => {
  const { api } = useHiber3D();

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onHiber3DEditorNewEntityCreated((payload) => {
      console.debug(payload);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  return null;
};

export const App = () => (
  <Hiber3D build={{webGPU: moduleFactoryWebGPU as any, webGL: moduleFactoryWebGL as any}}>
    <ExampleEvent />
  </Hiber3D>
);
