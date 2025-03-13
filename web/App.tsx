import { Hiber3D, useHiber3D } from "@hiber3d/web";
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
  <Hiber3D>
    <ExampleEvent />
  </Hiber3D>
);
