// Helpers
type Path<T> =
  // If T is not an object or it has no keys, then there are no deeper paths
  [keyof T] extends [never]
    ? []
    : {
        [K in keyof T]-?: [K, ...Path<T[K]>];
      }[keyof T];

type DeepValue<T, P extends unknown[]> = P extends [infer Head, ...infer Tail]
  ? Head extends keyof T
    ? DeepValue<T[Head], Tail>
    : never
  : T;

interface GetValueOverloads {
  // Overload #1: COMPONENT
  <C extends keyof Component, P extends Path<Component[C]>>(
    entity: Entity,
    componentName: C,
    ...path: P
  ): DeepValue<Component[C], P>;
}

interface SetValueOverloads {
  // Overload #1: COMPONENT
  <C extends keyof Component, P extends Path<Component[C]>>(
    entity: Entity,
    componentName: C,
    ...args: [...P, DeepValue<Component[C], P>]
  ): void;
}

// Specifics
type TransformProps = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
};

type Component = {
  "Hiber3D::Transform": TransformProps;
  "Hiber3D::SceneRoot": {
    scene: string;
  };
  "Hiber3D::Renderable": {
    mesh: string;
    material: string;
  };
  "Hiber3D::ComputedWorldTransform": TransformProps;
  "Hiber3D::Children": {
    entities: Entity[];
  };
  "Hiber3D::Parent": {
    parent: Entity;
  };
  "Hiber3D::Camera": {
    priority: number;
    fovDegrees: number;
    nearPlane: number;
    farPlane: number;
  };
  "Hiber3D::Name": string;
};

declare enum TouchEventType {
  BEGAN = 0,
  MOVED = 1,
  ENDED = 2,
  CANCELLED = 3,
}

type Event = {
  "Hiber3D::TouchEvent": {
    type: TouchEventType;
    touchCount: number;
    touches: {
      identifier: number;
      x: number;
      y: number;
      changed: boolean;
    }[];
  };
};

type CallableMethod = {
  keyIsPressed: (keyCode: number) => boolean;
  keyJustPressed: (keyCode: number) => boolean;
  keyJustReleased: (keyCode: number) => boolean;
};

type Entity = number;
type Script = unknown;
type ComponentName = keyof Component;

// 2. Declare the global variable:
declare global {
  const hiber3d: {
    print(...args: unknown[]): void;

    createEntity(): Entity;
    destroyEntity(entity: Entity): void;

    addScript(entity: Entity, scriptPath: string): void;
    removeScript(entity: Entity, scriptPath: string): void;
    getScript(entity: Entity, scriptPath: string): Script;
    hasScripts(entity: Entity, ...scriptPaths: string[]): boolean;

    addComponent(entity: Entity, componentName: ComponentName);
    removeComponent(entity: Entity, componentName: ComponentName): void;
    hasComponents(entity: Entity, ...componentNames: ComponentName[]): boolean;
    findEntitiesWithComponent(componentName: ComponentName): Entity[];

    getValue: GetValueOverloads;
    setValue: SetValueOverloads;

    call<T extends keyof CallableMethod>(
      method: T,
      ...args: Parameters<CallableMethod[T]>
    ): ReturnType<CallableMethod[T]>;

    addEventListener(entity: Entity, eventName: keyof Event): void;
    writeEvent<T extends keyof Event>(eventName: T, eventData: Event[T]): void;
  };
}

export {};
