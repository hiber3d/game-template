import { useEffect } from "react";
import { Hiber3D, useHiber3D } from "./hiber3d";

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
  <Hiber3D>
    <ExampleEvent />
  </Hiber3D>
);
