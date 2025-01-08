// useAPI.ts
import { useContext } from "react";
import { ApiContext } from "../context/ApiContext";

export const useAPI = () => {
  const context = useContext(ApiContext);
  // DISCUSS: Maybe we should throw if t to render stuff before the API is loaded
  if (context === undefined) {
    throw new Error("useAPI must be used within an ApiProvider");
  }
  return context.api;
};
