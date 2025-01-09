import { Hiber3DContext } from "hiber3d/context/Hiber3DContext";
import { useContext } from "react";

export const useHiber3D = () => {
  const context = useContext(Hiber3DContext);

  if (context === undefined) {
    throw new Error("useHiber3D must be used within the Hiber3DProvider");
  }

  return context;
};
