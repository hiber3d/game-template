// useAPI.ts
import { Hiber3DContext } from "hiber3d/context/Hiber3DContext";
import { useContext } from "react";

export const useAPI = () => {
  const hiber3d = useContext(Hiber3DContext);

  return hiber3d?.api;
};
