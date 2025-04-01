import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { useEffect } from "react";

const projectFiles = await import.meta.glob("../*.h3dproject", {
  eager: true,
  query: "?raw",
  import: "default",
});

Object.keys(projectFiles).forEach((key) => {
  const project = JSON.parse(projectFiles[key]);
  console.log(project);
});

// const a = (await import(`../${packageJson.title}.h3dproject?raw`)).default;
// console.log("Project:", JSON.parse(a));

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
