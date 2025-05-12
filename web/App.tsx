import { useEffect, useState } from "react";
import { Hiber3D, useHiber3D, GunStateChangedEvent } from "./hiber3d";

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
  <Hiber3D>
    <ExampleUI />
  </Hiber3D>
);
