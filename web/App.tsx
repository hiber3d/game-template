import { GunStateChangedEvent, Hiber3D, useHiber3D } from "@hiber3d/web";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { useEffect, useState } from "react";

const ExampleUI = () => {
  const { api } = useHiber3D();
  const [gunState, setGunState] = useState<GunStateChangedEvent | undefined>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGunStateChangedEvent((payload) => {
      setGunState(payload);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  if (!gunState) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        color: "white",
        padding: "12px 25px",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      <div>AMMO: {gunState.ammo}</div>
      {/* <div>HITS: {gunState.hits}</div> */}
    </div>
  );
};

export const App = () => (
  <Hiber3D build={{ webGPU, webGL }}>
    <ExampleUI />
  </Hiber3D>
);
