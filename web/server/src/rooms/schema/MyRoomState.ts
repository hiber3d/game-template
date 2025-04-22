import { MapSchema, Schema, type } from "@colyseus/schema";

export class Float4 extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  @type("number") w: number;
}

export class Player extends Schema {
  @type("number") x: number;
  @type("number") z: number;
  @type("number") rotX: number;
  @type("number") rotY: number;
  @type("number") rotZ: number;
  @type("number") rotW: number;
  @type("number") velocityX: number;
  @type("number") velocityZ: number;
  @type("boolean") isDead: boolean;
}

export class Bullet extends Schema {
  @type("number") owner: number;
  @type("number") time: number;
  @type("number") originX: number;
  @type("number") originZ: number;
  @type(Float4) rotation: Float4;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
