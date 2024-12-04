import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import launch, { MainModule, Options } from "@hiber3d/interop";

export type MethodListener = {
  name: string;
  method: (...args: unknown[]) => void;
};
export type AddMethodListener = (listener: MethodListener) => MethodListener;
export type RemoveMethodListener = (listener: MethodListener) => void;

type ApiContextType = {
  api: MainModule | null;
  addMethodListener: AddMethodListener;
  removeMethodListener: RemoveMethodListener;
  ref: RefObject<HTMLCanvasElement>;
  mainRef: RefObject<HTMLDivElement>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const Hiber3D = ({
  children,
  config,
}: {
  children?: ReactNode;
  config?: Options["config"];
}) => {
  const [api, setApi] = useState<MainModule | null>(null);
  const methodListners = useRef<MethodListener[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const initalized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (api || !canvasRef.current || initalized.current) {
        return;
      }
      initalized.current = true;
      const module = await launch({
        canvas: canvasRef.current,
        config,
      });

      const proxy = new Proxy<MainModule>(module, {
        get(target, key: keyof MainModule) {
          const method = target[key];

          if (
            typeof method !== "function" ||
            !methodListners.current.find((l) => l.name === key)
          ) {
            return method;
          }

          return (...args: unknown[]) => {
            methodListners.current
              .filter((listener) => listener.name === key)
              .forEach((listener) => listener.method(...args));

            return method.apply(target, args);
          };
        },
      });

      const event = new CustomEvent("initialized", { detail: { api: proxy } });
      document.dispatchEvent(event);

      setApi(proxy);
    };
    init();
  }, [api, canvasRef, initalized, config, methodListners]);

  const addMethodListener = useCallback<AddMethodListener>((listener) => {
    methodListners.current = [...methodListners.current, listener];
    return listener;
  }, []);

  const removeMethodListener = useCallback<RemoveMethodListener>((listener) => {
    methodListners.current = methodListners.current.filter(
      (l) => l !== listener
    );
  }, []);

  return (
    <ApiContext.Provider
      value={{
        api,
        addMethodListener,
        removeMethodListener,
        ref: canvasRef,
        mainRef,
      }}
    >
      <main ref={mainRef}>
        <canvas
          id="canvas"
          ref={canvasRef}
          className={`absolute inset-0 w-screen h-dvh opacity-1 transition-opacity duration-1000 delay-100`}
        />
        {children}
      </main>
    </ApiContext.Provider>
  );
};
