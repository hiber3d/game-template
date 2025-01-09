import { MainModule } from "@hiber3d/interop";
import { RefObject, createContext } from "react";

export type MethodListener = {
  name: string;
  method: (...args: unknown[]) => void;
};
export type AddMethodListener = (listener: MethodListener) => MethodListener;
export type RemoveMethodListener = (listener: MethodListener) => void;

type Hiber3DContextType = {
  api: MainModule | null;
  addMethodListener: AddMethodListener;
  removeMethodListener: RemoveMethodListener;
  ref: RefObject<HTMLCanvasElement>;
  mainRef: RefObject<HTMLDivElement>;
};

export const Hiber3DContext = createContext<Hiber3DContextType | undefined>(
  undefined
);
